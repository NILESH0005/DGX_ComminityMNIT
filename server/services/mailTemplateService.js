
import fs from "fs/promises";
import path from "path";
import db from "../models/index.js";

const TEMPLATE_DIR = path.resolve(
  process.cwd(),
  "templates",
  "emails"
);

const escapeHtml = (value) => {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
};

const validateUrl = (value) => {
  const url = new URL(String(value));

  if (!["https:", "http:"].includes(url.protocol)) {
    throw new Error("Invalid URL");
  }

  return url.toString();
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
  html = html.replace(
    /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
    (match, key) => {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        throw new Error(`Missing placeholder: ${key}`);
      }

      const value = urlKeys.includes(key)
        ? validateUrl(data[key])
        : data[key];

      return escapeHtml(value);
    }
  );

  // Replace subject placeholders
  const subject = template.Subject.replace(
    /{{\s*([a-zA-Z0-9_]+)\s*}}/g,
    (match, key) => {
      if (!Object.prototype.hasOwnProperty.call(data, key)) {
        throw new Error(`Missing subject placeholder: ${key}`);
      }

      return String(data[key] ?? "");
    }
  );

  return {
    templateId: template.ID,
    subject,
    html,
    cc: template.CC,
    bcc: template.BCC,
  };
};
