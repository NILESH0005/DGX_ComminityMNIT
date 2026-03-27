export default (sequelize, DataTypes) => {
  const QuizResult = sequelize.define(
    "QuizResult",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      obtainedMarks: {
        type: DataTypes.DECIMAL(5, 2),
      },
      totalMarks: {
        type: DataTypes.DECIMAL(5, 2),
      },
      percentage: {
        type: DataTypes.DECIMAL(5, 2),
      },
      isPass: {
        type: DataTypes.BOOLEAN,
      },
      isFail: {
        type: DataTypes.BOOLEAN,
      },
      noOfAttempts: {
        type: DataTypes.INTEGER,
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
      isDownload: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      tableName: "Quiz_Result",
      timestamps: false,
    },
  );

  return QuizResult;
};
