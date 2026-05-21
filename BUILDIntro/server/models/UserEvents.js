const userEventModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "UserEvents",
    {
      UserEventID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      EventID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      /* ===== Audit Fields ===== */

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
      tableName: "UserEvents",
      timestamps: false,
    },
  );
};

export default userEventModel;
