import UserModel from "../models/user.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "./uploads";
    if (fs.existsSync(uploadPath)) {
      cb(null, uploadPath);
    } else {
      fs.mkdirSync(uploadPath);
      cb(null, uploadPath);
    }
  },
  filename: function (req, file, cb) {
    const orgName = file.originalname;
    const ext = path.parse(orgName).ext;
    const name = path.parse(orgName).name;
    const fullname =
      name + "-" + Date.now() + "" + Math.round(Math.random() * 1e9) + ext;

    cb(null, fullname);
  },
});

const upload = multer({ storage: storage });


/* ===========================
        Auth
=============================*/
export const signUp = async (req, res) => {
  try {
    // Apply Multer middleware to handle file uploads
    upload.single("image")(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message, success: false });
      }

      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({
          message: "Please upload an image",
          success: false,
        });
      }

      // Destructure user data from request body
      const { firstname, email, password, contact, usertype, lastname } =
        req.body;

      // Hash password
      const hashPassword = bcrypt.hashSync(password, 10);

      // Create new user document
      const newUser = await UserModel.create({
        firstname,
        lastname,
        email,
        usertype,
        password: hashPassword,
        contact,
        image: req.file.filename, // Set image field to uploaded file's filename
      });

      // Check if user was created successfully
      if (newUser) {
        return res.status(201).json({
          data: newUser,
          message: "New user added successfully",
          success: true,
        });
      }

      // If newUser is null, return error response
      return res.status(400).json({
        message: "Failed to create user",
        success: false,
      });
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        message: "User doesn't exist!",
        success: false,
      });
    }

    const comparePassword = bcrypt.compareSync(password, existingUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Invalid credential",
        success: false,
      });
    }

    // If passwords match, generate JWT token
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET, // Replace with your secret key
      { expiresIn: "1h" }
    );

    // Exclude password from response data
    const responseData = { ...existingUser.toObject() };
    delete responseData.password;

    // Send token and user data in response
    return res.status(200).json({
      data: responseData,
      token: token,
      message: "Successfully logged in",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};
