import { IUser } from "@models/user.model";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
export class UserRepository extends BaseRepository<IUser> {
    UserModel: Model<IUser>
    constructor(model: Model<IUser>) {
        super(model)
        this.UserModel = model
    }
    async findUserByEmailOrUsername(user: Partial<IUser>) {
        if (user.email) {
            return await this.UserModel.findOne({ email: user.email })
        } else if (user.username) {
            return await this.UserModel.findOne({ username: user.username })
        } else {
            throw new Error('invalid arguments')
        }
    }
    async findByIdAndPopulatte(userId: string) {
        return await this.UserModel.findById(userId).populate(
            [
                {
                    path: 'followers',
                    select: 'id username password'
                },
                {
                    path: 'following',
                    select: 'id  username password'
                }
            ]
        )
    }
    // async verifyPassword(user:Partial<IUser>){
    //     const checkUser=await this.findById(user.id)
    //     if(!checkUser){
    //         throw new Error('User not found')
    //     }
    //     const passwordStatus=checkUser.comparePassword(user.password!)
    //     if(!passwordStatus){
    //         throw new Error('Invalid Credentials')
    //     }
    //     return true
    // }

}