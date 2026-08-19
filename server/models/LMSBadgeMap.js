export default (sequelize, DataTypes) => {
  const LMSBadgeMap = sequelize.define(
    "LMSBadgeMap",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      BadgeName: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Custom badge name for this LMS assignment",
      },
      ModuleID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      BadgeID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      BadgeImage: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
        comment: "Custom badge image for this assignment (base64)",
      },
      BadgeImagePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: "File path if image is stored as file",
      },
      isCustomImage: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Whether custom image is used instead of master",
      },
      // Standard 7 fields
      AuthAdd: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },
      AuthLstEdt: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },
      AuthDel: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },
      AddOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
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
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "LMSBadgeMap",
      timestamps: false,
    },
  );

  return LMSBadgeMap;
};
