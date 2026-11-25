import fs from "fs/promises";
import path from "path";
import db from "../models/index.js";

const TEMPLATE_DIR = path.resolve(process.cwd(), "templates", "emails");
const IMAGE_DIR = path.resolve(TEMPLATE_DIR, "images");

const IMAGE_MIME_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

const escapeHtml = (value) => {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
};

const validateUrl = (value) => {
  const url = new URL(String(value));

  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("Invalid URL");
  }

  return url.toString();
};

/**
 * Finds images in the template that live in templates/emails/images/
 * and embeds them in the mail as inline images, so they show INSIDE
 * the email instead of as broken links or attachments.
 *
 * Handled in the HTML:
 *   src="images/hero-first-badge.png"
 *   src="./images/hero-first-badge.png"
 *   src="cid:hero-first-badge"   (if images/hero-first-badge.png exists)
 *
 * Anything else (http/https URLs, badge cids like cid:milestone-badge)
 * is left unchanged.
 */
const embedLocalImages = async (html) => {
  const pattern = /src=(["'])(?:\.\/)?(images\/[\w.-]+|cid:[\w.-]+)\1/g;

  const inlineImages = [];
  const cidByRef = new Map();

  for (const match of html.matchAll(pattern)) {
    const ref = match[2];
    if (cidByRef.has(ref)) continue;

    let fileName;
    if (ref.startsWith("images/")) {
      fileName = ref.slice("images/".length);
    } else {
      const id = ref.slice("cid:".length);
      fileName = path.extname(id) ? id : `${id}.png`;
    }

    fileName = path.basename(fileName); // no path tricks
    const ext = path.extname(fileName).toLowerCase();
    if (!IMAGE_MIME_TYPES[ext]) continue;

    try {
      const content = await fs.readFile(path.resolve(IMAGE_DIR, fileName), {
        encoding: "base64",
      });

      const cid = path.basename(fileName, ext);
      if (!inlineImages.some((img) => img.cid === cid)) {
        inlineImages.push({ content, mime_type: IMAGE_MIME_TYPES[ext], cid });
      }
      cidByRef.set(ref, cid);
    } catch {
      // Not a local image file (e.g. the badge image cid) -> leave as is
    }
  }

  const outputHtml = html.replace(pattern, (full, quote, ref) =>
    cidByRef.has(ref) ? `src=${quote}cid:${cidByRef.get(ref)}${quote}` : full,
  );

  return { html: outputHtml, inlineImages };
};

export const getMailTemplate = async (templateCode, data = {}) => {
  // Fetch template configuration
  const template = await db.MailTemplateMaster.findOne({
    where: {
      TemplateCode: templateCode,
      delStatus: 0,
    },
  });

  if (!template) {
    throw new Error(`Template not found: ${templateCode}`);
  }

  // Read HTML file
  const fileName = path.basename(template.TemplateFileName);
  const filePath = path.resolve(TEMPLATE_DIR, fileName);

  if (path.dirname(filePath) !== TEMPLATE_DIR) {
    throw new Error("Invalid template path");
  }

  let html = await fs.readFile(filePath, "utf-8");

  const urlKeys = [
    "login_url",
    "reset_link",
    "module_url",
    "quiz_url",
    "course_url",
    "certificate_url",
    "blog_url",
    "edit_blog_url",
    "modules_url",
    "badges_url",
  ];

  // Replace HTML placeholders
  html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (data[key] === undefined) {
      throw new Error(`Missing placeholder: ${key}`);
    }
    return data[key];
  });

  // Embed local images (templates/emails/images/*) as inline images
  const embedded = await embedLocalImages(html);
  html = embedded.html;

  // Replace subject placeholders
  const subject = template.Subject.replace(
    /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
    (match, key) => {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        throw new Error(`Missing subject placeholder: ${key}`);
      }

      return String(data[key] ?? "");
    },
  );

  return {
    templateId: template.ID,
    subject,
    html,
    cc: template.CC,
    bcc: template.BCC,
    inlineImages: embedded.inlineImages,
  };
};
