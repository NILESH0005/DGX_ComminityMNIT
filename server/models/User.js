const userModel = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      UserID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Name: { type: DataTypes.STRING(500), allowNull: true },
      EmailId: { type: DataTypes.STRING(500), allowNull: false },
      CollegeName: { type: DataTypes.STRING(500), allowNull: true },
      MobileNumber: { type: DataTypes.STRING(15), allowNull: true },
      Category: { type: DataTypes.STRING(50), allowNull: true },
      Designation: { type: DataTypes.STRING(50), allowNull: true },
      ReferalNumberCount: { type: DataTypes.INTEGER, allowNull: true },
      ReferalNumber: { type: DataTypes.STRING(50), allowNull: true },
      ReferedBy: { type: DataTypes.INTEGER, allowNull: true },
      Password: { type: DataTypes.STRING(100), allowNull: true },
      FlagPasswordChange: { type: DataTypes.INTEGER, allowNull: true },
      AuthAdd: { type: DataTypes.STRING(100), allowNull: true },
      AuthDel: { type: DataTypes.STRING(100), allowNull: true },
      AuthLstEdt: { type: DataTypes.STRING(100), allowNull: true },
      delOnDt: { type: DataTypes.DATE, allowNull: true },
      AddOnDt: { type: DataTypes.DATE, allowNull: true },
      editOnDt: { type: DataTypes.DATE, allowNull: true },
      delStatus: { type: DataTypes.INTEGER, allowNull: true },
      isAdmin: { type: DataTypes.INTEGER, allowNull: true },
      ProfilePicture: { type: DataTypes.TEXT("long"), allowNull: true },
      UserDescription: { type: DataTypes.TEXT, allowNull: true },
      LastLoginDtTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      LoginCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      State: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      DistrictID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      QualificationID: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      Gender: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      MobileOTPVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      EmailOTPVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      EOTP: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },

      MOTP: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      OTPAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      OTPverifyStatus: {
        type: DataTypes.ENUM("active", "inactive", "blocked"),
        allowNull: false,
        defaultValue: "inactive",
      },
      Remark: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      OTPBlockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      RegNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      UploadFilePath: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      UploadFileName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      reg_mail_send_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      OTPResendAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "Community_User",
      timestamps: false,
    },
  );
};

export default userModel;
