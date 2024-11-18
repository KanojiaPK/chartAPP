import express from "express";
import { getAllCharts } from "../controllers/chart.controller.js";

const router = express.Router();

// router.post("/add-tickets", addTickets);
router.get("/get-chartAll", getAllCharts);
// router.get("/get-ticketsWithusers", getTicketsWithUserDetails);
// router.get("/get-ticket/:ticketid", getTicket);
// router.put("/update-ticket/:ticketid", updateTicket);

// router.put("/update-t/:ticketid", uploadImage);

export default router;
