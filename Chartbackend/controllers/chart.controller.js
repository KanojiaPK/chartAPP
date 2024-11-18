import Chart from "../models/chart.model.js";
import mongoose from "mongoose";

export const getAllCharts = async (req, res) => {
  try {
    console.log("Fetching all charts...");
    const charts = await Chart.find();
    console.log("Charts found:", charts);
    if (charts.length > 0) {
      return res.status(200).json({
        count: charts.length,
        data: charts,
        message: "Fetched all charts successfully!",
        success: true,
      });
    }
    return res.status(404).json({
      message: "No charts found",
      success: false,
    });
  } catch (err) {
    console.error("Error fetching charts:", err);
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
