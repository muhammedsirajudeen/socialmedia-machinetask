import PostModel from "@models/post.model";
import UserModel from "@models/user.model";
import { AuthController } from "controller/auth.controller";
import { PostController } from "controller/post.controller";
import { UserController } from "controller/user.controller";
import { PostRepository } from "repository/post.repository";
import { UserRepository } from "repository/user.repository";
import { PostService } from "services/post.service";
import { UserService } from "services/user.service";

const UserRepositoryInstance = new UserRepository(UserModel)
const UserServiceInstance = new UserService(UserRepositoryInstance)
const AuthControllerInstance = new AuthController(UserServiceInstance)

const PostRepositoryInstance=new PostRepository(PostModel)
const PostServiceInstance=new PostService(PostRepositoryInstance)
const PostControllerInstance=new PostController(PostServiceInstance)

const UserControllerInstance=new UserController(UserServiceInstance)





export {
    AuthControllerInstance,
    PostControllerInstance,
    UserControllerInstance
}