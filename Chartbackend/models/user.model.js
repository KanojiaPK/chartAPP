import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  usertype: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },

  created_at: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("user", UserSchema, "chartUsers");
