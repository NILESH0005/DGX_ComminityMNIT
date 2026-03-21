const BadgesMasterModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "badgesmaster",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      badge_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      badge_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      badge_category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      badge: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },

      badge_order: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      /* ================= AUDIT FIELDS ================= */

      AuthAdd: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      AuthDel: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      AuthLstEd: {
        type: DataTypes.INTEGER,
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
      tableName: "badgesmaster",
      timestamps: false,
    },
  );
};

export default BadgesMasterModel;
