import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import ApiError from "../utils/apiError.js";
import ApiSuccess from "../utils/apiSuccess.js";

const prisma = new PrismaClient();

// here we will use the jwt token for validation
export const authMiddleware = async function (req, res, next) {
  const token =
    req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    throw new ApiError(404, "Token not found");
  }

  try {
    const decodedToken = jwt.decode(token);
    let id = decodedToken.id;

    let checkUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!checkUser) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    req.user = checkUser;
    next();
  } catch (error) {
    console.log("From middleware", error);
    return;
  }
};

// for checking if the user already login or not
// we will create a function to check that the user are already logged in or not
// retrive token from header (authorization)
// check the user is exist or not

// this is worked ✅

export const isLoggedIn = async (req, res, next) => {
  try {
    const verificationToken = req.headers?.authorization?.split(" ")[1];

    if (!verificationToken) {
      throw new ApiError(404, "Verified token not found!");
    }

    // findUnique does't work because of ?(verificationToken?) but findFirst worked
    const isUserLoggedIn = await prisma.user.findFirst({
      where: {
        verificationToken,
      },
    });

    if (!isUserLoggedIn) {
      return res.json({ message: "user not found" });
    }

    // directly isUserLoggedIn.isVerified = true not worked because this is not actually updating the isVerified value
    // so I have to used the update query to update the isVerified in db
    await prisma.user.update({
      where: {
        id: isUserLoggedIn.id,
      },
      data: {
        isVerified: true,
      },
    });

    console.log(ApiSuccess.create(200, "User logged in"));
    next();
  } catch (error) {
    throw new ApiError(404, "Something went wrong!", error);
  }
};
