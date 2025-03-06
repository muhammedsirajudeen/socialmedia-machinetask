import {User,Post,Comment} from "shared"

export interface IUser extends User{}

export interface IPost extends Post{}

export interface IComment extends Omit<Comment,"authorId">{
    authorId:IUser
}

export interface PopulatedPost extends Omit<Post,"authorId"|"comments">{
    authorId:IUser;
    comments:IComment[]
}