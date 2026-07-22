// import db from './models/index.js';

// (async () => {
//   try {
//     await db.sequelize.sync({ alter: true });
//     console.log('✅ All models synced to MySQL');
//     process.exit();
//   } catch (error) {
//     console.error('❌ Error syncing models:', error);
//     process.exit(1);
//   }
// })();

import db from "./models/index.js";

(async () => {
  try {
    // Check database connection
    await db.sequelize.authenticate();
    console.log("✅ Database connected");

    // Show all registered models
    console.log("Registered Models:");
    console.log(Object.keys(db.sequelize.models));

    // Check CollegeMaster model
    console.log("CollegeMaster Model:", db.CollegeMaster);

    // Sync only CollegeMaster
    await db.CollegeMaster.sync({
      alter: true,
      logging: console.log,
    });

    console.log("✅ CollegeMaster synced successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Error syncing:", error);
    process.exit(1);
  }
})();