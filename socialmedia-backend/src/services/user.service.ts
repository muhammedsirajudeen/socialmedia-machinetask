import { IUser } from "@models/user.model";
import { BaseService } from "./base.service";
import { UserRepository } from "repository/user.repository";
import { Logger } from "winston";
import { logger } from "@config/logger";

export class UserService extends BaseService<IUser,UserRepository>{
    protected repository: UserRepository;
    logger:Logger
    
    constructor(repository:UserRepository){
        super(repository)
        this.repository=repository
        this.logger=logger
    }
}