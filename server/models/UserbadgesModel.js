const UserBadgesModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "UserBadges",
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
      ModuleID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      badgesId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isView: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      achievedOn: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      AuthAdd: DataTypes.INTEGER,
      AuthDel: DataTypes.INTEGER,
      AuthLstEdt: DataTypes.INTEGER,
      AddOnDt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      editOnDt: DataTypes.DATE,
      delOnDt: DataTypes.DATE,
      delStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "userBadges", // existing DB table
      timestamps: false,
    },
  );
};

export default UserBadgesModel;
