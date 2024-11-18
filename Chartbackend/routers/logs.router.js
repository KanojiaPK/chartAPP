import express from "express";
import {
  createLogAndFetchChart,
  fetchAllLogs,
} from "../controllers/logs.controller.js";

const router = express.Router();

// POST: Submit log and fetch chart data
router.post("/submit-log", createLogAndFetchChart);
router.get("/logsALL", fetchAllLogs);

export default router;
