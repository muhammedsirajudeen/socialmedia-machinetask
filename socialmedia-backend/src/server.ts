import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import connectDB from "@config/db";
import Redis from "ioredis";
import authRouter from "@routes/auth.routes";
import { setupSwagger } from "@swagger/setup";
import { logger } from "@config/logger";
import { HttpStatus } from "@utils/HttpStatus";
import { CustomError } from "@utils/custom.error";
import userRouter from "@routes/user.routes";
import { IUser } from "@models/user.model";
import { existsSync, mkdirSync } from "fs";
import cors from "cors"
import path from "path"
dotenv.config();
connectDB();
// essentially meant to be used later
const _redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});
declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}
const app = express();
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); 
app.use(cors({
  origin:process.env.FRONTEND_URL,
  methods:['GET','POST','PUT','DELETE'],
  credentials:true
}))
if(!existsSync(path.join(__dirname,"./uploads"))){
  mkdirSync(path.join(__dirname,"./uploads"))
}
setupSwagger(app);
app.use(express.json());

/*
  Authentication Routes
*/
app.use("/api/auth", authRouter)
app.use("/api/user/",userRouter)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error | CustomError, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof (CustomError)) {
    res.status(err.status).json({ message: "", error: err.error })
    return
  }
  logger.info(err.message)
  if (err.message.includes('validation')) {
    res.status(HttpStatus.BAD_REQUEST).json({ message: "", error: err.message })
    return
  } else if (err.message.includes('duplicate')) {
    res.status(HttpStatus.CONFLICT).json({ message: "", error: err.message })
    return
  }
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "", error: err.message })
})
app.use((req, res) => {
  logger.info(req.url)
  res.status(HttpStatus.NOT_FOUND).json({ message: "Route Not Found" })
})

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

