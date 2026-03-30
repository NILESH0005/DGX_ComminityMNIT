import sequelize from "../config/database.js";

export const getScheduler = async () => {

  const [rows] = await sequelize.query(`
    SELECT id, scheduleName, status, isRunning
    FROM schedules
    WHERE scheduleName = 'MAIL_SCHEDULER'
    LIMIT 1
  `);

  return rows[0];

};

export const setSchedulerRunning = async (id, value) => {

  await sequelize.query(`
    UPDATE schedules
    SET isRunning = :value,
        lastRun = NOW()
    WHERE id = :id
  `, {
    replacements: { id, value }
  });

};

export const stopScheduler = async (id) => {

  await sequelize.query(`
    UPDATE schedules
    SET status = 0,
        isRunning = 0,
        lastRun = NOW()
    WHERE id = :id
  `, {
    replacements: { id }
  });

};