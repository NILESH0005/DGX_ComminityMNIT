const UniversityMasterModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "UniversityMaster",
    {
      UniversityID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      UniversityName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      UniversityShortName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      
      AuthAdd: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      AuthLstEdt: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      AuthDel: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      AddOnDt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },

      editOnDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delOnDT: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      delStatus: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "UniversityMaster",
      timestamps: false,
    }
  );
};

export default UniversityMasterModel;