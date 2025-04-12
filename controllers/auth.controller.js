import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { withAccelerate } from "@prisma/extension-accelerate";
import sendEmail from "../utils/mailtrap.js";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter }).$extends(withAccelerate());

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

export const loginUser = async function (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      message: "Invalid credenetials",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is not matched",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const cookieOptions = {
      httpOnly: true,
    };
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      message: "login success",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Login failed",
      error,
    });
  }
};

export const logoutUser = async function (req, res) {
  const { id } = req.user;
};

export const getAllUser = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();

  return res.json(users);
});
