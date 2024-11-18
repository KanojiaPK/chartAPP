// controllers/log.controller.js
import Log from "../models/logs.model.js";
import Chart from "../models/chart.model.js";

export const createLogAndFetchChart = async (req, res) => {
  try {
    const { access_time, access_date, employee_name, algo_status } = req.body;

    // Validate the request body
    if (!access_time || !access_date || !employee_name || !algo_status) {
      return res.status(400).json({
        message:
          "All fields (access_time, access_date, employee_name, algo_status) are required.",
        success: false,
      });
    }

    // Create and save the log entry
    const log = new Log({
      access_time,
      access_date,
      employee_name,
      algo_status,
    });

    await log.save();

    // Fetch chart data based on algo_status
    const statusValue = algo_status === "Energy Saving Mode ON" ? 1 : 0;
    const chartData = await Chart.find({ algo_status: statusValue });

    // Respond with the log and chart data
    return res.status(200).json({
      message: "Log saved successfully and chart data fetched.",
      success: true,
      log,
      chartData,
    });
  } catch (error) {
    console.error("Error in createLogAndFetchChart:", error);
    return res.status(500).json({
      message: `An error occurred: ${error.message}`,
      success: false,
    });
  }
};

export const fetchAllLogs = async (req, res) => {
  try {
    // Fetch all logs from the database
    const logs = await Log.find();

    // Respond with the retrieved logs
    return res.status(200).json({
      message: "Logs fetched successfully.",
      success: true,
      logs,
    });
  } catch (error) {
    console.error("Error in fetchAllLogs:", error);
    return res.status(500).json({
      message: `An error occurred: ${error.message}`,
      success: false,
    });
  }
};
