export default (sequelize, DataTypes) => {
  const GradeScale = sequelize.define(
    "GradeScale",
    {
      GradeScaleID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      QuizID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      RangeFrom: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },

      RangeTo: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },

      GradeValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      Grade: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      AuthAdd: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },

      AuthDel: {
        type: DataTypes.STRING(800),
        allowNull: true,
      },

      AuthLstEdt: {
        type: DataTypes.STRING(800),
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
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "GradeScale",
      timestamps: false,
    }
  );

  return GradeScale;
};