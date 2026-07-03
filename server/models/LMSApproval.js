export default (sequelize, DataTypes) => {
  const LMSApproval = sequelize.define(
    "LMSApproval",
    {
      LMSApprovalID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      LMSID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      ApprovalUserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      ApprovalDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      Status: {
        type: DataTypes.ENUM(
          "Draft",
          "Pending",
          "Approved",
          "Rejected"
        ),
        defaultValue: "Draft",
      },

      Remark: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      AuthAdd: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },

      AuthDel: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },

      AuthLstEdt: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },

      AddOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      editOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "LMSApproval",
      timestamps: false,
    }
  );

  return LMSApproval;
};