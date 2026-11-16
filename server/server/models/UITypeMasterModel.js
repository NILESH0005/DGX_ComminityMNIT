const uiTypeMasterModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "UITypeMaster",
    {
      UITypeID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      UIName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      UIKey: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true, // 🔥 important (gamified, native, etc.)
      },

      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      /* ================= AUDIT FIELDS ================= */

      AuthAdd: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      AuthDel: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      AuthLstEdt: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      delOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      AddOnDt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      editOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "UITypeMaster",
      timestamps: false,
    }
  );
};

export default uiTypeMasterModel;