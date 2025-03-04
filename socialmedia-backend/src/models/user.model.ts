import mongoose, { ObjectId, Schema,Document } from "mongoose"
import { User } from "shared"


export interface IUser extends Omit<User, "id"|"followers" | "following">, Document {
    followers: ObjectId[]
    following: ObjectId[]
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String,
            required: false
        },
        bio: {
            type: String,
            required: false
        },
        followers: {
            type: [mongoose.Types.ObjectId],
            required: false,
            default: []
        },
        following: {
            type: [mongoose.Types.ObjectId],
            required: false,
            default: []
        },
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
)

const UserModel = mongoose.model("User", userSchema)
export default UserModel