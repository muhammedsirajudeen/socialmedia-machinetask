import {User,Post,Comment} from "@muhammedsirajudeenpersonal/shared"

//this is kind of like recursive types too i guess right
export interface IUser extends Omit<User,"following"|"followers">{
    following:IUser[]
    followers:IUser[]
}

export interface IPost extends Post{}

export interface IComment extends Omit<Comment,"authorId">{
    authorId:IUser
}

export interface PopulatedPost extends Omit<Post,"authorId"|"comments"|"likes">{
    authorId:IUser;
    comments:IComment[]
    likes:IUser[]
}