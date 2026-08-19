// models/ModuleDetails.js
export default (sequelize, DataTypes) => {
  const ModuleDetails = sequelize.define(
    "ModuleDetails",
    {
      ModuleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      ModuleName: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      ModuleImage: {
        type: DataTypes.BLOB,
        allowNull: true,
      },
      ModuleDescription: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },
      AuthAdd: {
        type: DataTypes.STRING(800),
        allowNull: false,
      },
      AuthDel: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },
      AuthLstEdt: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },
      delOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      AddOnDt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      editOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      delStatus: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      SortingOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ModuleImagePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      EventType: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      BatchID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      UITypeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      onBackShowSubModule: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      quizAccessOnSubModuleCompletion: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      hasCertificate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      LMSLevel: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      LMSUserCategory: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      ModuleTags: {
        type: DataTypes.STRING(2000),
        allowNull: true,
      },
      isBadgeEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Enable badges for this module",
      },
    },
    {
      tableName: "ModuleDetails",
      timestamps: false,
    },
  );

  return ModuleDetails;
};
