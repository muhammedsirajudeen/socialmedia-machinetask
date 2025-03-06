import { IPost } from "@models/post.model";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";

export class PostRepository extends BaseRepository<IPost>{
    _model:Model<IPost>
    constructor(model:Model<IPost>){
        super(model)
        this._model=model
    }
    async createAndPopulate(post:IPost){
        return await (await this.create(post)).populate({path:'likes',select:'username profilepicture'})
    }
    async updateAndPopulate(id:string,post:Partial<IPost>){
        return await (await this.update(id,post))?.populate({path:'likes',select:'username profilepicture'})
    }
    async findAndPopulate(){
        return await this._model.find().populate([{path:'authorId',select:'-password'},{path:'comments.authorId',select:'-password'}])
    }
}

