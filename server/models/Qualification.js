const qualificationModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "Qualification",
    {
      QualificationID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      QualificationName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      AuthAdd: { type: DataTypes.STRING(100), allowNull: true },
      AuthDel: { type: DataTypes.STRING(100), allowNull: true },
      AuthLstEdt: { type: DataTypes.STRING(100), allowNull: true },
      delOnDt: { type: DataTypes.DATE, allowNull: true },
      AddOnDt: { type: DataTypes.DATE, allowNull: true },
      editOnDt: { type: DataTypes.DATE, allowNull: true },
      delStatus: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "Qualification",
      timestamps: false,
    },
  );
};

export default qualificationModel;
