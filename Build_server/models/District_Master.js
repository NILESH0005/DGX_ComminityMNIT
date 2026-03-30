const districtMasterModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "District_Master",
    {
      DistrictID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      DistrictName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      State: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      Country: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "India",
      },

      /* ================= AUDIT FIELDS ================= */

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
      tableName: "District_Master",
      timestamps: false,
    }
  );
};

export default districtMasterModel;