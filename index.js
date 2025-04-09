import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import ws from 'ws'
import { neonConfig } from "@neondatabase/serverless";


const app = express();
const PORT = process.env.PORT || 8000;


neonConfig.webSocketConstructor = ws

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`server running at: http://localhost:${PORT}`);
});
