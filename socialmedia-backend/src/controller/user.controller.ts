import { NextFunction, Request, Response } from "express";
import { IUser } from "@models/user.model";
import { UserService } from "services/user.service";
import { HttpMessage, HttpStatus } from "@utils/HttpStatus";
import { CustomError } from "@utils/custom.error";
import { isObjectIdOrHexString } from "mongoose";

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

}