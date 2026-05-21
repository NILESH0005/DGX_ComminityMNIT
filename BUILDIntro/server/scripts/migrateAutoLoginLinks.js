import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import db from "../models/index.js";

const migrateLinks = async () => {
  try {
    const rows = await db.LMSSubModulesDetails.findAll({
      where: {
        delStatus: 0,
      },
    });

    console.log(`Found ${rows.length} records`);

    for (const row of rows) {
      const oldLink = row.AutoLoginLink;

      if (!oldLink) continue;

      // Skip already encrypted links
      if (oldLink.includes("token=")) {
        const updatedLink = oldLink.replace(
          "https://ngevent.servergi.com",
          "https://ngevent.servergi.com:3000",
        );

        await row.update({
          AutoLoginLink: updatedLink,
        });

        console.log(`Updated domain for ${row.SubModuleID}`);

        continue;
      }

      try {
        const url = new URL(oldLink);

        const moduleId = url.searchParams.get("moduleId");
        const subModuleId = url.searchParams.get("subModuleId");

        if (!moduleId || !subModuleId) {
          console.log(`Invalid link: ${oldLink}`);
          continue;
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            moduleId,
            subModuleId,
          },
          process.env.AUTO_LOGIN_SECRET,
          {
            expiresIn: "365d",
          },
        );

        // Create encrypted URL
        const newLink = `https://ngevent.servergi.com:3000/auto-login?token=${token}`;
        // Update DB
        await row.update({
          AutoLoginLink: newLink,
        });

        console.log(`Updated SubModuleID ${row.SubModuleID}`);
      } catch (err) {
        console.log(`Error processing link`, err.message);
      }
    }

    console.log("Migration completed");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

migrateLinks();
