const VideoProgress = (sequelize, DataTypes) => {
  return sequelize.define(
    "VideoProgress",
    {
      ProgressID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      FileID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      CurrentTime: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        comment: "Current playback position in seconds",
      },

      Duration: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      WatchPercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },

      IsCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      MaxWatchedTime: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        comment: "Prevents skipping ahead",
      },

      LastWatchedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      AuthAdd: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      AuthDel: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      AuthLstEdt: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      delOnDt: {
        type: DataTypes.DATE,
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

      delStatus: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "VideoProgress",
      timestamps: false,
    }
  );
};

export default VideoProgress;