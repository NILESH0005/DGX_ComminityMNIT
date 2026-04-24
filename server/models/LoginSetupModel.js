const LoginSetupModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "LoginSetup",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      discription: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      // 🔥 Global access rule
      accessDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // ⏳ Optional grace period
      graceDays: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      isunblockedHours: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔒 Global control
      isLoginEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      canQuery: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      // 🧾 Audit Fields
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

      AddOnDt: {
        type: DataTypes.DATE,
        allowNull: true,
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
        type: DataTypes.BOOLEAN,
        allowNull: true, // no default, must be explicitly set
      },
     
    },
    {
      tableName: "loginSetup",
      timestamps: false,
    },
  );
};

export default LoginSetupModel;
