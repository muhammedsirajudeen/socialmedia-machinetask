import {User,Post} from "shared"

export interface IUser extends User{}

export interface IPost extends Post{}

export interface PopulatedPost extends Omit<Post,"authorId">{
    authorId:IUser
}