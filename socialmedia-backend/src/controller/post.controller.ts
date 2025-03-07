import {  CommentModel, IPost } from "@models/post.model";
import { PostService } from "services/post.service";
import { NextFunction, Request,Response } from "express";
import { HttpMessage, HttpStatus } from "@utils/HttpStatus";
import { CustomError } from "@utils/custom.error";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import { logger } from "@config/logger";
export class PostController{
    service:PostService
    constructor(service:PostService){
        this.service=service
    }
    async createPost(req:Request,res:Response,next:NextFunction){
        try {
            const user=req.user
            if(!user){
                throw new CustomError(HttpMessage.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
            }
            const postRequest:IPost=req.body
            postRequest.authorId=user.id
            const newPost=await this.service.create(postRequest)
            res.status(HttpStatus.CREATED).json({message:HttpStatus.CREATED,post:newPost})
        } catch (error) {
            next(error)
        }
    }
    async updatePost(req:Request,res:Response,next:NextFunction){
        try {
            //tight coupling kinda like violations fix it later
            const {id}=req.params
            if(!id || !isObjectIdOrHexString(id)){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            //guard for BOLA owasp #1
            const postRequest:IPost=req.body
            const updatedPost=await this.service.updateAndPopulate(id,postRequest,req.user?.id)
            res.status(HttpStatus.OK).json({message:HttpStatus.OK,post:updatedPost})
        } catch (error) {
            next(error)
        }
    }
    async deletePost(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            if(!id || !isObjectIdOrHexString(id)){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            await this.service.deleteWithChecks(id,req.user?.id)
            res.status(HttpStatus.NO_CONTENT).json({message:""})
        } catch (error) {
            next(error)
        }
    }
    async likeAPost(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            const userId=req.user
            if(!id || !isObjectIdOrHexString || !userId){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            const updatedPost=await this.service.addLikes(id,userId.id)
            res.status(HttpStatus.OK).json({message:HttpStatus.OK,post:updatedPost})
        } catch (error) {
            next(error)
        }
    }
    async dislikeAPost(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            const userId=req.user
            if(!id || !isObjectIdOrHexString || !userId){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            const updatedPost=await this.service.dislike(id,userId.id)
            res.status(HttpStatus.OK).json({message:HttpStatus.OK,post:updatedPost})
        } catch (error) {
            next(error)
        }
    }
    async GetPost(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            if(!id || !isObjectIdOrHexString(id)){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            const post=await this.service.findById(id)
            res.status(HttpStatus.OK).json({message:HttpMessage.OK,post})
        } catch (error) {
            next(error)
        }
    }
    async GetAllPosts(req:Request,res:Response,next:NextFunction){
        try {
            const posts=await this.service.findAllAndPopulate()
            res.status(HttpStatus.OK).json({message:HttpMessage.OK,posts})
        } catch (error) {
            next(error)
        }
    }
    async GetPostsByUser(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            const userId=req.user
            if(!userId){
                throw new CustomError(HttpMessage.UNAUTHORIZED,HttpStatus.UNAUTHORIZED)
            }
            const posts=await this.service.findByUserAndPopulate(id)
            res.status(HttpStatus.OK).json({message:HttpMessage.OK,posts})
        } catch (error) {
            next(error)
        }
    }

    async AddComments(req:Request,res:Response,next:NextFunction){
        try {
            const {id}=req.params
            if(!id || !isObjectIdOrHexString(id)){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            const authorId=req.user
            const commentRequest=req.body
            const newComment = new CommentModel(
                {
                    authorId: new mongoose.Types.ObjectId(authorId?.id),
                    content:commentRequest.content,
                    likes: [],
                    likeCount: 0,
                    dislikeCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            )
            const newPost=await this.service.addComment(id,newComment)
            
            logger.info(newPost)
            if(!newPost){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            res.status(HttpStatus.OK).json({message:HttpStatus.OK,post:newPost})
        } catch (error) {
            next(error)
        }
    }
    async RemoveComment(req:Request,res:Response,next:NextFunction){
        try {
            const {postId}=req.params
            const {commentId}=req.params
            const userId=req.user
            if(!postId || !userId|| !commentId || !isObjectIdOrHexString(commentId) || !isObjectIdOrHexString(postId)){
                throw new CustomError(HttpMessage.BAD_REQUEST,HttpStatus.BAD_REQUEST)
            }
            await this.service.removeComment(postId,commentId,userId.id)
            res.status(HttpStatus.NO_CONTENT).json({message:""})
        } catch (error) {
            next(error)
        }
    }
}