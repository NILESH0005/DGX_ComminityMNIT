import { getScheduler, setSchedulerRunning } from "../services/schedulerService.js";
import { processMailJob } from "../services/mailJob.js";

export const sendPendingMails = async (req, res) => {

  try {

    const scheduler = await getScheduler();

    // Scheduler disabled
    if (!scheduler || scheduler.status === 0) {
      return res.json({
        success: false,
        message: "Scheduler disabled"
      });
    }

    // Job already running
    if (scheduler.isRunning === 1) {
      return res.json({
        success: false,
        message: "Mail job already running"
      });
    }

    // Mark scheduler running
    await setSchedulerRunning(scheduler.id, 1);

    // Start background job (do not await)
    processMailJob(scheduler.id)
      .catch(err => {
        console.error("Background Mail Job Error:", err);
      });

    // Immediate response to API
    return res.json({
      success: true,
      message: "📨 Email job started successfully"
    });

  } catch (error) {

    console.error("API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Error starting mail job",
      error: error.message
    });

  }

};