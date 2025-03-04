import { NextFunction, Request,Response } from "express";
import { IUser } from "@models/user.model";
import { UserService } from "services/user.service";
import { HttpStatus } from "@utils/HttpStatus";

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
            
            res.status(HttpStatus.OK).json({message:HttpStatus.OK,user})
        }catch(err){
            next(err)
        }
    }
}