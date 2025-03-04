import express from "express";
import dotenv from "dotenv";
import connectDB from "@config/db";
import Redis from "ioredis";
import {User as _User} from "shared"
dotenv.config();
connectDB();
// essentially meant to be used later
const _redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express + TypeScript Server");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

