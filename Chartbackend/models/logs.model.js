// models/log.model.js
import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  access_time: {
    type: String,
    required: true,
  },
  access_date: {
    type: Date,
    required: true,
  },
  employee_name: {
    type: String,
    required: true,
  },
  algo_status: {
    type: String,
    required: true, 
    enum: ["Energy Saving Mode ON", "Energy Saving Mode OFF"],
  },
});

const Log = mongoose.model("Log", LogSchema, "chartLogs");
export default Log;
