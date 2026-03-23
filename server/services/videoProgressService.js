import db from "../models/index.js";
import { recalculateCourseProgress } from "./UserbadgesService.js";
import { Op, Sequelize } from "sequelize"; // ✅ direct import

const VideoProgress = db.Video_Progress;

export const saveVideoProgressService = async ({
  UserID,
  FileID,
  CurrentTime,
  Duration,
}) => {
  const watchPercentage = Duration > 0 ? (CurrentTime / Duration) * 100 : 0;

  const isCompleted = watchPercentage >= 98;

  let progress = await VideoProgress.findOne({
    where: { UserID, FileID },
  });

  if (!progress) {
    progress = await VideoProgress.create({
      UserID,
      FileID,
      CurrentTime,
      Duration,
      WatchPercentage: watchPercentage,
      IsCompleted: isCompleted,
      LastWatchedAt: new Date(),
    });
  } else {
    await progress.update({
      CurrentTime,
      Duration,
      WatchPercentage: watchPercentage,
      IsCompleted: isCompleted,
      LastWatchedAt: new Date(),
    });
  }
  console.log(
    "🚀 ~ file: videoProgressService.js:35 ~ saveVideoProgressService ~ progress:",
    progress.toJSON(),
  );
  // 🎯 AUTO BADGE CHECK

  console.log(
    "🚀 ~ file: videoProgressService.js:38 ~ saveVideoProgressService ~ isCompleted:",
    UserID,
  );
  if (progress.IsCompleted) {

    console.log(
      "🚀 ~ file: videoProgressService.js:41 ~ saveVideoProgressService ~ Recalculating course progress for UserID:",
      UserID, "FileID:", FileID
    );
    
    await recalculateCourseProgress(UserID, FileID); // Assuming CourseID is 8 for now
  }

  return progress;
};

export const getVideoProgressService = async (UserID, FileID) => {
  const progress = await VideoProgress.findOne({
    where: { UserID, FileID },
  });

  if (!progress) {
    return {
      CurrentTime: 0,
      WatchPercentage: 0,
      IsCompleted: false,
    };
  }

  return progress;
};

const isYoutubeUrl = (filePath) => {
  if (!filePath) return false;
  return filePath.includes("youtube.com") || filePath.includes("youtu.be");
};

export const getSubmoduleCompletionStatusService = async (moduleID, userID) => {
  try {
    // =========================
    // STEP 1: Get Submodules
    // =========================
    const subModules = await db.LMSSubModulesDetails.findAll({
      where: { ModuleID: moduleID, delStatus: 0 },
      attributes: ["SubModuleID", "SubModuleName", "SortingOrder"],
      order: [["SortingOrder", "ASC"]],
    });

    if (!subModules.length) return [];

    const subModuleIDs = subModules.map((sm) => sm.SubModuleID);

    // =========================
    // STEP 2: Get Units
    // =========================
    const units = await db.LMSUnitsDetails.findAll({
      where: {
        SubModuleID: { [Op.in]: subModuleIDs },
        delStatus: 0,
      },
      attributes: ["UnitID", "SubModuleID"],
    });

    if (!units.length) {
      return subModules.map((sm) => ({
        SubModuleID: sm.SubModuleID,
        SubModuleName: sm.SubModuleName,
        IsCompleted: false,
        totalFiles: 0,
        completedFiles: 0,
      }));
    }

    const unitIDs = units.map((u) => u.UnitID);

    // Map Unit → Submodule
    const unitToSubModule = {};
    units.forEach((u) => {
      unitToSubModule[u.UnitID] = u.SubModuleID;
    });

    // =========================
    // STEP 3: Get Files
    // =========================
    const files = await db.LMSFilesDetails.findAll({
      where: {
        UnitID: { [Op.in]: unitIDs },
        delStatus: 0,
      },
      attributes: ["FileID", "UnitID", "FilePath"],
    });

    if (!files.length) {
      return subModules.map((sm) => ({
        SubModuleID: sm.SubModuleID,
        SubModuleName: sm.SubModuleName,
        IsCompleted: false,
        totalFiles: 0,
        completedFiles: 0,
      }));
    }

    // =========================
    // STEP 4: Split Files
    // =========================
    const youtubeFiles = [];
    const normalFiles = [];

    files.forEach((f) => {
      if (isYoutubeUrl(f.FilePath)) {
        youtubeFiles.push(f);
      } else {
        normalFiles.push(f);
      }
    });

    const youtubeFileIDs = youtubeFiles.map((f) => f.FileID);
    const normalFileIDs = normalFiles.map((f) => f.FileID);

    // =========================
    // STEP 5: Fetch Progress
    // =========================

    // YouTube Progress
    const videoProgressRows = youtubeFileIDs.length
      ? await db.Video_Progress.findAll({
          where: {
            UserID: userID,
            FileID: { [Op.in]: youtubeFileIDs },
          },
          attributes: ["FileID", "IsCompleted"],
        })
      : [];

    // Normal File Progress (existence = completed)
    const fileProgressRows = normalFileIDs.length
      ? await db.LMSUserProgress.findAll({
          where: {
            UserID: userID,
            FileID: { [Op.in]: normalFileIDs },
            delStatus: 0,
          },
          attributes: ["FileID"],
        })
      : [];

    // =========================
    // STEP 6: Build Completion Map
    // =========================
    const fileCompletionMap = {};

    // YouTube
    videoProgressRows.forEach((p) => {
      fileCompletionMap[p.FileID] = p.IsCompleted === true;
    });

    // Normal files
    fileProgressRows.forEach((p) => {
      fileCompletionMap[p.FileID] = true;
    });

    // =========================
    // STEP 7: Map Files to Submodules
    // =========================
    const subModuleFiles = {};
    subModuleIDs.forEach((id) => {
      subModuleFiles[id] = [];
    });

    files.forEach((f) => {
      const smID = unitToSubModule[f.UnitID];
      if (smID !== undefined) {
        subModuleFiles[smID].push(f.FileID);
      }
    });

    // =========================
    // STEP 8: Final Calculation
    // =========================
    const result = subModules.map((sm) => {
      const fileIDs = subModuleFiles[sm.SubModuleID] || [];
      const totalFiles = fileIDs.length;

      let completedCount = 0;
      fileIDs.forEach((fid) => {
        if (fileCompletionMap[fid]) completedCount++;
      });

      const IsCompleted = completedCount === totalFiles && totalFiles > 0;

      return {
        SubModuleID: sm.SubModuleID,
        SubModuleName: sm.SubModuleName,
        IsCompleted,
        totalFiles,
        completedFiles: completedCount,
      };
    });

    return result;
  } catch (error) {
    console.error("Error in getSubmoduleCompletionStatusService:", error);
    throw error;
  }
};
