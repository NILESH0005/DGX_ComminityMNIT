import db from "../models/index.js";
import { recalculateCourseProgress } from "./UserbadgesService.js";
import { Op, Sequelize, QueryTypes } from "sequelize"; // ✅ direct import

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
      UserID,
      "FileID:",
      FileID,
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

// export const getSubmoduleCompletionStatusService = async (moduleID, userID) => {
//   try {
//     // =========================
//     // STEP 1: Get Submodules
//     // =========================
//     const subModules = await db.LMSSubModulesDetails.findAll({
//       where: { ModuleID: moduleID, delStatus: 0 },
//       attributes: ["SubModuleID", "SubModuleName", "SortingOrder"],
//       order: [["SortingOrder", "ASC"]],
//     });

//     if (!subModules.length) return [];

//     const subModuleIDs = subModules.map((sm) => sm.SubModuleID);

//     // =========================
//     // STEP 2: Get Units
//     // =========================
//     const units = await db.LMSUnitsDetails.findAll({
//       where: {
//         SubModuleID: { [Op.in]: subModuleIDs },
//         delStatus: 0,
//       },
//       attributes: ["UnitID", "SubModuleID"],
//     });

//     if (!units.length) {
//       return subModules.map((sm) => ({
//         SubModuleID: sm.SubModuleID,
//         SubModuleName: sm.SubModuleName,
//         IsCompleted: false,
//         totalVideos: 0,
//         completedVideos: 0,
//       }));
//     }

//     const unitIDs = units.map((u) => u.UnitID);

//     // Map Unit → Submodule
//     const unitToSubModule = {};
//     units.forEach((u) => {
//       unitToSubModule[u.UnitID] = u.SubModuleID;
//     });

//     // =========================
//     // STEP 3: Get Files (ONLY VIDEOS)
//     // =========================
//     const files = await db.LMSFilesDetails.findAll({
//       where: {
//         UnitID: { [Op.in]: unitIDs },
//         delStatus: 0,
//       },
//       attributes: ["FileID", "UnitID", "FilePath"],
//     });

//     if (!files.length) {
//       return subModules.map((sm) => ({
//         SubModuleID: sm.SubModuleID,
//         SubModuleName: sm.SubModuleName,
//         IsCompleted: false,
//         totalVideos: 0,
//         completedVideos: 0,
//       }));
//     }

//     // =========================
//     // STEP 4: FILTER ONLY VIDEO FILES
//     // =========================
//     const isVideo = (filePath) => {
//       if (!filePath) return false;

//       const path = filePath.toLowerCase();

//       return (
//         path.includes("youtube") ||
//         path.includes("video") ||
//         path.includes("mp4") ||
//         path.includes("webm") ||
//         path.includes("ogg")
//       );
//     };

//     const videoFiles = files.filter((f) => isVideo(f.FilePath));

//     const videoFileIDs = videoFiles.map((f) => f.FileID);

//     if (!videoFileIDs.length) {
//       return subModules.map((sm) => ({
//         SubModuleID: sm.SubModuleID,
//         SubModuleName: sm.SubModuleName,
//         IsCompleted: false,
//         totalVideos: 0,
//         completedVideos: 0,
//       }));
//     }

//     // =========================
//     // STEP 5: Fetch Video Progress
//     // =========================
//     const videoProgressRows = await db.Video_Progress.findAll({
//       where: {
//         UserID: userID,
//         FileID: { [Op.in]: videoFileIDs },
//       },
//       attributes: ["FileID", "IsCompleted"],
//     });

//     // =========================
//     // STEP 6: Build Completion Map
//     // =========================
//     const videoCompletionMap = {};

//     videoProgressRows.forEach((p) => {
//       if (Number(p.IsCompleted) === 1) {
//         videoCompletionMap[p.FileID] = true;
//       }
//     });

//     // =========================
//     // STEP 7: Map Videos to Submodules
//     // =========================
//     const subModuleVideos = {};
//     subModuleIDs.forEach((id) => {
//       subModuleVideos[id] = [];
//     });

//     videoFiles.forEach((f) => {
//       const smID = unitToSubModule[f.UnitID];
//       if (smID !== undefined) {
//         subModuleVideos[smID].push(f.FileID);
//       }
//     });

//     // =========================
//     // STEP 8: Final Calculation
//     // =========================
//     const result = subModules.map((sm) => {
//       const vids = subModuleVideos[sm.SubModuleID] || [];
//       const totalVideos = vids.length;

//       let completedCount = 0;
//       vids.forEach((vid) => {
//         if (videoCompletionMap[vid]) completedCount++;
//       });

//       const IsCompleted = totalVideos > 0 && completedCount === totalVideos;

//       return {
//         SubModuleID: sm.SubModuleID,
//         SubModuleName: sm.SubModuleName,
//         IsCompleted,
//         totalVideos,
//         completedVideos: completedCount,
//       };
//     });

//     return result;
//   } catch (error) {
//     console.error("Error in getSubmoduleCompletionStatusService:", error);
//     throw error;
//   }
// };

export const getSubmoduleCompletionStatusService = async (moduleID, userID) => {
  try {
    const result = await db.sequelize.query(
      `
     SELECT 
    sub.SubModuleID,
    sub.SubModuleName,
    sub.totalFiles,
    sub.completedFiles,

    CASE 
        WHEN sub.totalFiles > 0 AND sub.completedFiles = sub.totalFiles THEN 1
        ELSE 0
    END AS IsCompleted

FROM (
    SELECT 
        sm.SubModuleID,
        sm.SubModuleName,
        sm.SortingOrder,

        COUNT(DISTINCT f.FileID) AS totalFiles,

       COUNT(DISTINCT 
    CASE 
        -- 🎥 YOUTUBE / VIDEO (STRICT)
        WHEN (
            LOWER(f.FilePath) LIKE '%youtube%' 
            OR LOWER(f.FilePath) LIKE '%youtu.be%'
        )
        THEN 
            CASE 
                WHEN vp.IsCompleted = 1 THEN f.FileID
                ELSE NULL
            END

        -- 📄 OTHER FILES
        ELSE 
            CASE 
                WHEN lp.FileID IS NOT NULL THEN f.FileID
                ELSE NULL
            END
    END
) AS completedFiles

    FROM submodulesdetails sm

    LEFT JOIN unitsdetails u 
        ON u.SubModuleID = sm.SubModuleID
        AND u.delStatus = 0

    LEFT JOIN filesdetails f 
        ON f.UnitID = u.UnitID
        AND f.delStatus = 0

    -- 🎥 VIDEO PROGRESS
    LEFT JOIN (
        SELECT FileID, UserID, MAX(IsCompleted) as IsCompleted
        FROM videoprogress
        GROUP BY FileID, UserID
    ) vp 
        ON vp.FileID = f.FileID 
        AND vp.UserID = :userID

    -- 📄 FILE PROGRESS
    LEFT JOIN (
        SELECT DISTINCT FileID, UserID
        FROM userlmsprogress
        WHERE delStatus = 0
    ) lp 
        ON lp.FileID = f.FileID 
        AND lp.UserID = :userID

    WHERE 
        sm.ModuleID = 1
        AND sm.delStatus = 0

    GROUP BY 
        sm.SubModuleID,
        sm.SubModuleName,
        sm.SortingOrder

    ORDER BY 
        sm.SortingOrder ASC
) AS sub;
      `,
      {
        replacements: { moduleID, userID },
        type: QueryTypes.SELECT,
      },
    );

    return result;
  } catch (error) {
    console.error("Error in getSubmoduleCompletionStatusService:", error);
    throw error;
  }
};
