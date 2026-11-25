export default (sequelize, DataTypes) => {
  const Setup = sequelize.define(
    "Setup",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      setupName: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      details: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      threshold: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },

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
      tableName: "setup",
      timestamps: false,
    },
  );

  return Setup;
};
