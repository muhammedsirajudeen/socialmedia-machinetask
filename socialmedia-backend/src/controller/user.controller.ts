import { NextFunction, Request,Response } from "express";
import { IUser } from "@models/user.model";
import { UserService } from "services/user.service";

export class UserController{
    service:UserService
    constructor(service:UserService){
        this.service=service
    }
    async Signup(req:Request,res:Response,next:NextFunction){
        try{
            const userRequest:IUser=req.body
            const user=await this.service.create(userRequest)
            //honestly we do need DTO's here
            
            res.status(200).json({message:"success",user})
        }catch(err){
            next(err)
        }
    }
}