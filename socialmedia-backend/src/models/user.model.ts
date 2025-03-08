import mongoose, {  Schema,Document } from "mongoose"
import { User } from "shared"
import bcrypt from "bcrypt"

export interface IUser extends Omit<User, "id"|"followers" | "following">, Document {
    followers: mongoose.Types.ObjectId[]
    following: mongoose.Types.ObjectId[]
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique:true
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        password:{
            type:String,
            required:true,
            unique:false
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
            default: [],
            ref:'User'
        },
        following: {
            type: [mongoose.Types.ObjectId],
            required: false,
            default: [],
            ref:'User'
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
userSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err as Error);
    }
});
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("User", userSchema)
export default UserModel