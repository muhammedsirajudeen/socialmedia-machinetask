import express from "express";
import dotenv from "dotenv";
import connectDB from "@config/db";
import Redis from "ioredis";
import authRouter from "@routes/auth.routes";
import { setupSwagger } from "@swagger/setup";
import { logger } from "@config/logger";
dotenv.config();
connectDB();
// essentially meant to be used later
const _redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

const app = express();
setupSwagger(app);
app.use(express.json());

/*
  Authentication Routes
*/
app.use("/api/",authRouter)

app.use((req,res)=>{
  logger.info(req.url)
  res.json({message:"not found"})
})

const PORT = process.env.PORT || 5000;

 
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

