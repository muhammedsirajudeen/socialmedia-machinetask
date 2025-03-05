import { NextFunction, Request, Response } from "express";
import { IUser } from "@models/user.model";
import { UserService } from "services/user.service";
import { HttpMessage, HttpStatus } from "@utils/HttpStatus";
import { CustomError } from "@utils/custom.error";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import {v2 as cloudinary} from "cloudinary"
import path from "path";
import { logger } from "@config/logger";
import { unlink } from "fs/promises";

export class UserController {
    service: UserService
    constructor(service: UserService) {
        this.service = service
    }
    async UpdateProfile(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            const user=req.user
            if(!id ||!user || !isObjectIdOrHexString(id)){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            const updateProfile:Partial<IUser>={username:req.body.username,email:req.body.email,password:req.body.password}
            const updatedUser=await this.service.UpdateProfile(id,updateProfile,user.id)
            if(!updatedUser){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            res.status(HttpStatus.OK).json({message:HttpMessage.OK,user:{...updatedUser.toObject(),password:undefined}})
        } catch (error) {
            next(error)
        }
    }

    async FollowSomeone(req:Request,res:Response,next:NextFunction){
        try {
            
            const {id}=req.params
            const userId=req.user
            if(!id || !isObjectIdOrHexString(id) || !userId){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            const updatedProfile=await this.service.addToSet(userId.id,'following',new mongoose.Types.ObjectId(id))
            await this.service.addToSet(id,'followers',new mongoose.Types.ObjectId(userId.id))
            if(!updatedProfile){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)                
            }
            res.status(HttpStatus.OK).json({message:HttpMessage.OK,user:updatedProfile})

        } catch (error) {   
            next(error)
        }
    }
    async UnfollowSomeone(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.user;
            if (!id || !isObjectIdOrHexString(id) || !userId) {
                throw new CustomError(HttpMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
            }
            const updatedProfile = await this.service.pull(userId.id, 'following', new mongoose.Types.ObjectId(id));
            await this.service.pull(id, 'followers', new mongoose.Types.ObjectId(userId.id));
            if (!updatedProfile) {
                throw new CustomError(HttpMessage.BAD_REQUEST, HttpStatus.BAD_REQUEST);
            }
            res.status(HttpStatus.OK).json({ message: HttpMessage.OK, user: updatedProfile });
        } catch (error) {
            next(error);
        }
    }
    async Uploads(req:Request,res:Response,next:NextFunction){
        try {
            console.log(req.files)
            cloudinary.config({ 
                cloud_name: 'dp0f5mdrj', 
                api_key: process.env.CLOUDINARY_API, 
                api_secret: process.env.CLOUDINARY_SECRET // Click 'View API Keys' above to copy your API secret
            });
            const files = req.files as Express.Multer.File[];
            if (!files) {
                throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            const fileNames=files.map((file)=>file.filename)
            const urls:string[]=[]
            for(let i=0;i<fileNames.length;i++){
                const uploadResult = await cloudinary.uploader
                    .upload(
                        path.join(__dirname, "../uploads", fileNames[i]), {
                        public_id: fileNames[i],
                    }
                    )
                    .catch((error) => {

                        logger.error(error)
                        throw new CustomError(HttpMessage.INTERNAL_SERVER_ERROR,HttpStatus.INTERNAL_SERVER_ERROR)
                    });
                    urls.push(uploadResult.secure_url)
            }
            for(let i=0;i<fileNames.length;i++){
                await unlink(path.join(__dirname,"../uploads",fileNames[i]))
            }
            res.status(HttpStatus.OK).json({message:HttpMessage.OK,urls})
        } catch (error) {
            next(error)
        }
    }
    // console.log(file)
    // const result= writeFileSync(path.join(__dirname,"../public",file.originalname),file.buffer)
    // const uploadResult = await cloudinary.uploader
    // .upload(
    //     path.join(__dirname,"../public",file.originalname), {
    //         public_id: file.originalname,
    //     }
    // )
    // .catch((error) => {
    //     console.log(error);
    // });
    // if(!uploadResult){
    //     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: HttpStatusMessage[HttpStatus.INTERNAL_SERVER_ERROR] })
    //     return
    // }

}