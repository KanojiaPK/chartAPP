import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
export const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization;
      const decodeToken = jwt.verify(token, process.env.JWT_SECRET);
      if (decodeToken) {
        const id = decodeToken.id;
        const userdata = await userModel.findOne({ _id: id });
        req.user = userdata;
        next();
      } else {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
    } else {
      return res.status(401).json({
        message: "Token not found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
