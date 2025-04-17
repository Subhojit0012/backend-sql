import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { withAccelerate } from "@prisma/extension-accelerate";
import sendEmail from "../utils/mailtrap.js";
import ApiSuccess from "../utils/apiSuccess.js";
import ApiError from "../utils/apiError.js";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter }).$extends(withAccelerate());

// Register user:
export const registerUser = async function (req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    console.log("Data is missing");
    return res.status(404).json({
      message: "All fields are required",
      success: false,
    });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(404).json({
      message: "User already exists",
      success: false,
    });
  }

  const hash = await bcrypt.hash(password, 10);
  const token = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hash,
      verificationToken: token,
    },
  });

  if (!user) {
    return res.status(400).json({ message: "User not created!" });
  }

  const result = await sendEmail(user.email, token);

  if (result) {
    return res.status(200).json({
      user,
    });
  }

  return res.status(400).json({
    message: "Failed to send Email to the user",
  });
};

const verify = async function (req, res) {
  const { token } = req.parse.token;
};

// Login user:
export const loginUser = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "Invalid credenetials",
    });
  }

  try {
    // get the user:
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "User not exists",
      });
    }

    if (user.isLoggedIn) {
      throw new ApiError(400, "user already logged in");
    }

    // match the password:
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is not matched",
      });
    }

    // make sure the user is verified before logged in:
    if (user.isVerified) {
      // create the token
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      if (!token) {
        throw new ApiError(400, "Token not created");
      }

      // you have to update like this
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isLoggedIn: true,
          verificationToken: token,
        },
      });

      const cookieOptions = {
        httpOnly: true,
      };
      res.cookie("token", token, cookieOptions);

      return res.json(
        ApiSuccess.create(200, "User login successfull", updatedUser)
      );
    }

    throw new ApiError(404, "User is not verified");
  } catch (error) {
    return res.status(400).json({
      message: "Login failed",
      error,
    });
  }
};

// this is the password reset controller
export const passwordReset = async function (req, res, next) {
  const { newPassword } = req.body;
  const { user } = req.user;

  if (!newPassword) {
    throw new ApiError(404, "Please enter new Password!");
  }

  try {
    if (!user) {
      throw new ApiError(400, "failed to get user object");
    }
    // bcrypt the new password
    const newBryptPassword = await bcrypt.hash(newPassword, 10);

    if (!newBryptPassword) {
      throw new ApiError("Failed to hashed the password!");
    }

    const getPassword = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: newBryptPassword,
      },
    });

    if (!getPassword) {
      throw new ApiError(404, "Failed to update the password");
    }

    return ApiSuccess.create(200, "Password changed!");
  } catch (error) {
    throw new ApiError(500, "Something went wrong!", error);
  }
};

export const logoutUser = async function (req, res) {
  const { id } = req.user;
};

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();

  if (!users) {
    throw new ApiError(400, "There is no users");
  }

  return res.json(users);
});
