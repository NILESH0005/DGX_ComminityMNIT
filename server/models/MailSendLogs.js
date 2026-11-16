const MailSendLogsModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "MailSendLogs",
    {
      ID: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      UserID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      TemplateID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      RecipientEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      LMSID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      DiscussionID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BlogID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      EventID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      MAILSEND: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      UserMailType: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      MailStatus: {
        type: DataTypes.ENUM("PENDING", "SENT", "FAILED"),
        defaultValue: "PENDING",
      },
      ErrorMessage: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      AuthAdd: DataTypes.STRING(100),
      AuthDel: DataTypes.STRING(100),
      AuthLstEdt: DataTypes.STRING(100),
      delOnDt: DataTypes.DATE,
      AddOnDt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      editOnDt: DataTypes.DATE,
      delStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "MailSendLogs",
      timestamps: false,
    },
  );
};

export default MailSendLogsModel;
