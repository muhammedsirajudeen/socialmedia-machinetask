import { IPost } from "@models/post.model";
import { BaseRepository } from "./base.repository";
import mongoose, { Model } from "mongoose";

export class PostRepository extends BaseRepository<IPost> {
    _model: Model<IPost>
    constructor(model: Model<IPost>) {
        super(model)
        this._model = model
    }
    async createAndPopulate(post: IPost) {
        return await (await this.create(post)).populate({ path: 'likes', select: 'username profilepicture' })
    }
    async updateAndPopulate(id: string, post: Partial<IPost>) {
        return await (await this.update(id, post))?.populate({ path: 'likes', select: 'username profilepicture' })
    }
    //@ts-ignore
     transformId=(obj: any)=> {
        if (Array.isArray(obj)) {
            return obj.map(this.transformId);
        } else if (obj && obj instanceof Date) {
            return obj.toISOString()
        }
        else if (obj && typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
                if (key === '_id') {
                    newObj['id'] = obj[key];
                } else if (key !== 'id') {
                    newObj[key] = this.transformId(obj[key]);
                }
            }
            return newObj;
        }
        return obj;
    }
    async findAndPopulate() {
        //tosolve: the problem is the id here
        const results = await this._model.find().populate([
            { path: 'authorId', select: '-password' },
            { path: 'comments.authorId', select: '_id id username email profile_picture' },
            { path: 'likes', select: 'username  profile_picture' }
        ])
            .lean()

        const transformedResults = results.map(this.transformId);

        return transformedResults
    }
    async findBySearchAndPopulate(post: Partial<IPost>) {
        const results = await this._model.find({ content: new RegExp(post.content!) }).populate([
            { path: 'authorId', select: '-password' },
            { path: 'comments.authorId', select: '_id id username email profile_picture' },
            { path: 'likes', select: 'username  profile_picture' }
        ])
            .lean()


        const transformedResults = results.map(this.transformId);
        return transformedResults
    }
    async findByUserAndPopulate(userId: string) {
        //tosolve: the problem is the id here
        const results = await this._model.find({ authorId: userId }).populate([{ path: 'authorId', select: '-password' }, { path: 'comments.authorId', select: '_id id username email profile_picture' }]).lean()
        const transformedResults = results.map(this.transformId);
        return transformedResults
    }
    async findByFollowingAndPopulate(following: string[]) {
        //tosolve: the problem is the id here
        const ObjectIDs = following.map((id) => new mongoose.Types.ObjectId(id))
        const results = await this._model.find({ authorId: { $in: ObjectIDs } }).populate([{ path: 'authorId', select: '-password' }, { path: 'comments.authorId', select: '_id id username email profile_picture' }]).lean()
        const transformedResults = results.map(this.transformId);
        return transformedResults
    }
}

