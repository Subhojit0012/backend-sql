import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authMiddleware = async function (req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(400).json({
      message: "Token not found",
    });
  }

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
};
