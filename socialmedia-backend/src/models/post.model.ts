import mongoose, { Document, Schema } from "mongoose";
import { Comment, Post } from "shared";

export interface IComment extends Document, Omit<Comment, "id" | "authorId" | "likes"> {
    authorId: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
}

export interface IPost extends Document, Omit<Post, "id" | "authorId" | "comments" | "likes"|"dislikes"> {
    authorId: mongoose.Types.ObjectId;
    comments: IComment[];
    likes: mongoose.Types.ObjectId[];
    dislikes:mongoose.Types.ObjectId[]
}

interface Media {
    type: string;
    url: string;
}

const mediaSchema: Schema<Media> = new Schema(
    {
        type: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        },
        toObject: {
            virtuals: true
        }
    }
);

const commentSchema: Schema<IComment> = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            required: false,
            default: []
        },
        likeCount: {
            type: Number,
            required: false,
            default: 0
        },
        dislikeCount: {
            type: Number,
            required: false,
            default: 0
        }
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        },
        toObject: {
            virtuals: true
        }
    }
);

const postSchema: Schema<IPost> = new Schema(
    {
        authorId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        content: {
            type: String,
            required: true
        },
        media: {
            type: [mediaSchema],
            required: false,
            default: []
        },
        likes: {
            type: [Schema.Types.ObjectId],
            ref: 'User',
            required: false,
            default: []
        },
        likeCount: {
            type: Number,
            required: false,
            default: 0
        },
        dislikeCount: {
            type: Number,
            required: false,
            default: 0
        },
        commentsCount: {
            type: Number,
            required: false,
            default: 0
        },
        comments: {
            type: [commentSchema],
            required: false,
            default: []
        },
        dislikes:{
            type:[mongoose.Schema.ObjectId],
            required:false,
            default:[],
            ref:'User'
        }
        
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        },
        toObject: {
            virtuals: true
        }
    }
);

const PostModel = mongoose.model<IPost>('Post', postSchema);
export default PostModel;