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
    await recalculateCourseProgress(UserID, 9); // Assuming CourseID is 8 for now
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
  // Step 1: Submodules
  const subModules = await db.LMSSubModulesDetails.findAll({
    where: { ModuleID: moduleID, delStatus: 0 },
    attributes: ["SubModuleID", "SubModuleName", "SortingOrder"],
    order: [["SortingOrder", "ASC"]],
  });

  if (!subModules.length) return [];

  const subModuleIDs = subModules.map((sm) => sm.SubModuleID);

  // Step 2: Units
  const units = await db.LMSUnitsDetails.findAll({
    where: {
      SubModuleID: { [Op.in]: subModuleIDs },
      delStatus: 0,
    },
    attributes: ["UnitID", "SubModuleID"],
  });

  const unitIDs = units.map((u) => u.UnitID);

  const unitToSubModule = {};
  units.forEach((u) => {
    unitToSubModule[u.UnitID] = u.SubModuleID;
  });

  // Step 3: Files
  const files = await db.LMSFilesDetails.findAll({
    where: {
      UnitID: { [Op.in]: unitIDs },
      delStatus: 0,
    },
    attributes: ["FileID", "UnitID", "FilePath"],
  });

  const youtubeFiles = files.filter((f) => isYoutubeUrl(f.FilePath));
  const youtubeFileIDs = youtubeFiles.map((f) => f.FileID);

  const subModuleYoutubeFiles = {};
  subModuleIDs.forEach((id) => {
    subModuleYoutubeFiles[id] = [];
  });

  youtubeFiles.forEach((f) => {
    const smID = unitToSubModule[f.UnitID];
    if (smID !== undefined) {
      subModuleYoutubeFiles[smID].push(f.FileID);
    }
  });

  // Step 4: Progress
  const progressRows = youtubeFileIDs.length
    ? await db.Video_Progress.findAll({
        where: {
          UserID: userID,
          FileID: { [Op.in]: youtubeFileIDs },
        },
        attributes: ["FileID", "IsCompleted"],
      })
    : [];

  const fileCompletionMap = {};
  progressRows.forEach((p) => {
    fileCompletionMap[p.FileID] = p.IsCompleted === true;
  });

  // Step 5: Final Data
  return subModules.map((sm) => {
    const ytFileIDs = subModuleYoutubeFiles[sm.SubModuleID] || [];
    const totalYoutubeFiles = ytFileIDs.length;

    let completedCount = 0;
    ytFileIDs.forEach((fid) => {
      if (fileCompletionMap[fid]) completedCount++;
    });

    const IsCompleted =
      totalYoutubeFiles === 0 || completedCount === totalYoutubeFiles;

    return {
      SubModuleID: sm.SubModuleID,
      SubModuleName: sm.SubModuleName,
      IsCompleted,
      totalYoutubeFiles,
      completedFiles: completedCount,
    };
  });
};
