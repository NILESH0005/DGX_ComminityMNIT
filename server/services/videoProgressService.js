import db from "../models/index.js";

const VideoProgress = db.Video_Progress;

export const saveVideoProgressService = async ({
  UserID,
  FileID,
  CurrentTime,
  Duration,
}) => {
  const watchPercentage =
    Duration > 0 ? (CurrentTime / Duration) * 100 : 0;

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