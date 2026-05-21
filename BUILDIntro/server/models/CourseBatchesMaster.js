const courseBatchesMasterModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "CourseBatchesMaster",
    {
      batch_ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      batch_Name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      batch_Group: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      batchMonth: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      Active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      ForSchool: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "CourseBatchesMaster",
      timestamps: false,
    }
  );
};

export default courseBatchesMasterModel;