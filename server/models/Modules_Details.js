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
<<<<<<< HEAD
=======
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
>>>>>>> 436d2bc667e0b0de423b8f17655dab9e8d93c9f1
    },
    {
      tableName: "ModuleDetails",
      timestamps: false,
    },
  );

  return ModuleDetails;
};
