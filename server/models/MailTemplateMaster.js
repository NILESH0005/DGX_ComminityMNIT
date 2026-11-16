
const MailTemplateMasterModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "MailTemplateMaster",
    {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      TemplateCode: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },

      TemplateFileName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      Subject: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },

      Details: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      CC: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      BCC: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      Remark: {
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
      tableName: "MailTemplateMaster",
      timestamps: false,
    }
  );
};

export default MailTemplateMasterModel;
