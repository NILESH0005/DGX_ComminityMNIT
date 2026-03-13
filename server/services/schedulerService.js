import sequelize from "../config/database.js";

export const getScheduler = async () => {

  const [rows] = await sequelize.query(`
    SELECT * FROM schedules 
    WHERE scheduleName = 'MAIL_SCHEDULER'
    LIMIT 1
  `);

  return rows[0];

};

export const setSchedulerRunning = async (value) => {

  await sequelize.query(`
    UPDATE schedules
    SET isRunning = :value,
        lastRun = NOW()
    WHERE scheduleName = 'MAIL_SCHEDULER'
  `, {
    replacements: { value }
  });

};

export const stopScheduler = async () => {

  await sequelize.query(`
    UPDATE schedules
    SET status = 0,
        isRunning = 0,
        lastRun = NOW()
    WHERE scheduleName = 'MAIL_SCHEDULER'
  `);

};