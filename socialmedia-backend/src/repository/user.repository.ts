import { IUser } from "@models/user.model";
import { BaseRepository } from "./base.repository";
import {  Model } from "mongoose";
export class UserRepository extends BaseRepository<IUser>{
    UserModel:Model<IUser>
    constructor(model:Model<IUser>){
        super(model)
        this.UserModel=model
    }
}