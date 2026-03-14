const BlobAchievementModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "blobachievement",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      blobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      achievedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      tableName: "blobachievement",
      timestamps: false,
    }
  );
};

export default BlobAchievementModel;