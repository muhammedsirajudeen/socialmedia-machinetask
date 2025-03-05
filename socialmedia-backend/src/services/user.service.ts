import { IUser } from "@models/user.model";
import { BaseService } from "./base.service";
import { UserRepository } from "repository/user.repository";
import { Logger } from "winston";
import { logger } from "@config/logger";
import { CustomError } from "@utils/custom.error";
import { HttpMessage, HttpStatus } from "@utils/HttpStatus";
export class UserService extends BaseService<IUser,UserRepository>{
    protected repository: UserRepository;
    logger:Logger
    
    constructor(repository:UserRepository){
        super(repository)
        this.repository=repository
        this.logger=logger
    }
    async verifyPassword(user:Partial<IUser>){
        const checkUser=await this.repository.findUserByEmailOrUsername(user)
        if(!checkUser){
            throw new Error('User not found')
        }
        if(!checkUser.comparePassword(user.password!)){
            throw new Error('Invalid credentials')
        }
        return checkUser
    }
    async UpdateProfile(id:string,user:Partial<IUser>,userId:string){
        const checkUser=await this.repository.findById(id)
        if(!checkUser){
            throw new CustomError(HttpMessage.NOT_FOUND,HttpStatus.NOT_FOUND)
        }
        if(userId!==checkUser.id){
            throw new CustomError(HttpMessage.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
        }
        return await this.repository.update(id,user)
        
    }

}