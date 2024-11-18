import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EnergySavingsSchema = new Schema({
  savings_percent: { type: Number, default: 0 },
  ref_kwh: { type: Number, default: 0 },
  us_meter: { type: Number, default: 0 },
  us_calc: { type: Number, default: 0 },
  inv_factor: { type: Number, default: 0 },
});

const WeatherSchema = new Schema({
  max_temp: { type: Number },
  min_temp: { type: Number },
});

const ChartDataSchema = new Schema({
  serialNo: { type: String, required: true },
  clientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  deviceMapID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeviceMap",
    required: true,
  },
  devices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Device" }],
  total_kwh: { type: Number, default: 0 },
  ac_run_hrs: { type: Number, default: 0 },
  ac_fan_hrs: { type: Number, default: 0 },
  algo_status: { type: Number, default: 0 },
  billing_ammount: { type: Number, default: 0 },
  cost_reduction: { type: Number, default: 0 },
  energy_savings: { type: EnergySavingsSchema },
  mitigated_co2: { type: Number, default: 0 },
  weather: { type: WeatherSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chart", ChartDataSchema, "chartData");
