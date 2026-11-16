import sequelize from "../config/database.js";

export const fetchPendingEmailsBatch = async (limit) => {

  const [users] = await sequelize.query(`
    SELECT userId, emailId
    FROM community_user
    WHERE reg_mail_send_status IS NULL
       OR reg_mail_send_status = 0
    LIMIT :limit
  `,{
    replacements: { limit }
  });

  return users;

};

export const updateMailStatusBulk = async (userIds) => {

  if (!userIds.length) return;

  await sequelize.query(`
    UPDATE community_user
    SET reg_mail_send_status = 1
    WHERE userId IN (:userIds)
  `,{
    replacements: { userIds }
  });

};