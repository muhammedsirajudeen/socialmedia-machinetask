import { IComment, IPost } from "@models/post.model";
import { BaseService } from "./base.service";
import { PostRepository } from "repository/post.repository";
import { CustomError } from "@utils/custom.error";
import { HttpMessage, HttpStatus } from "@utils/HttpStatus";
import mongoose from "mongoose";

export class PostService extends BaseService<IPost, PostRepository> {
    protected repository: PostRepository;
    constructor(repository: PostRepository) {
        super(repository)
        this.repository = repository
    }
    async createAndPopulate(post: IPost) {
        return await this.repository.createAndPopulate(post)
    }
    async updateAndPopulate(id: string, post: Partial<IPost>, userid: string) {
        const checkPost = await this.repository.findById(id)
        if (!checkPost) {
            throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (checkPost.authorId.toHexString() !== userid) {
            throw new CustomError(HttpMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }
        return await this.repository.updateAndPopulate(id, post)
    }
    async deleteWithChecks(id: string, userid: string) {
        const deletePost = await this.repository.findById(id)
        if (!deletePost) {
            throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND)
        }
        if (deletePost.authorId.toHexString() !== userid) {
            throw new CustomError(HttpMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }
        return await this.repository.delete(id)
    }
    //try to add transactions wherever necessary
    async addLikes(id: string, userId: string) {
        const checkPost = await this.repository.findById(id);
        if (!checkPost) {
            throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        // Check if the user already liked the post
        if (checkPost.likes.includes(userObjectId)) {
            await this.repository.pull(id, 'likes', userObjectId);
            return await this.repository.decrementField(id, 'likeCount');
        }

        // Remove from dislikes if the user has disliked the post
        if (checkPost.dislikes.includes(userObjectId)) {
            await this.repository.pull(id, 'dislikes', userObjectId);
            await this.repository.decrementField(id, 'dislikeCount');
        }

        await this.repository.addToSet(id, 'likes', userObjectId);
        return await this.repository.incrementField(id, 'likeCount');
    }

    async dislike(id: string, userId: string) {
        const checkPost = await this.repository.findById(id);
        if (!checkPost) {
            throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        const userObjectId = new mongoose.Types.ObjectId(userId);
        // Check if the user already disliked the post
        if (checkPost.dislikes.includes(userObjectId)) {
            await this.repository.pull(id, 'dislikes', userObjectId);
            return await this.repository.decrementField(id, 'dislikeCount');
        }

        // Remove from likes if the user has liked the post
        if (checkPost.likes.includes(userObjectId)) {
            await this.repository.pull(id, 'likes', userObjectId);
            await this.repository.decrementField(id, 'likeCount');
        }

        await this.repository.addToSet(id, 'dislikes', userObjectId);
        return await this.repository.incrementField(id, 'dislikeCount');
    }
    async addComment(id: string, comment: IComment) {
        const checkPost = await this.repository.findById(id)
        if (!checkPost) {
            throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        // kinda violation against repository pattern
        checkPost.comments.push(comment as unknown as IComment)
        await checkPost.save();
        return await this.repository.findById(id);
    }
    async removeComment(postId:string,commentId:string,userId:string){
        const post=await this.repository.findById(postId)
        if(!post){
            throw new CustomError(HttpMessage.NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        //Again ensuring bola restriction
        post.comments.forEach((comment)=>{
            if(comment.id===commentId && comment.authorId.toHexString()!==userId){
                throw new CustomError(HttpMessage.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
            }
        })
        return await this.repository.pull(postId,'comments',{_id:new mongoose.Types.ObjectId(commentId)})
    }
    async findAllAndPopulate(){
        return await this.repository.findAndPopulate()
    }
    async findBySearchAndPopulate(post:Partial<IPost>){
        return await this.repository.findBySearchAndPopulate(post)
    }
    async findByUserAndPopulate(userId:string){
        return await this.repository.findByUserAndPopulate(userId)
    }
    async findByFollowingAndPopulate(following:string[]){
        return await this.repository.findByFollowingAndPopulate(following)
    } 
}