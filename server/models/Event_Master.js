const masterEventModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "MasterEvent",
    {
      EventID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      EventName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      PageID: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
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
      isBadgeEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true, // ✅ badges ON by default
      },  
    },
    {
      tableName: "MasterEvent",
      timestamps: false,
    },
  );
};

export default masterEventModel;
