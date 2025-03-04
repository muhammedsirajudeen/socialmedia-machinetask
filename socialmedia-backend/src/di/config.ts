import UserModel from "@models/user.model";
import { UserController } from "controller/user.controller";
import { UserRepository } from "repository/user.repository";
import { UserService } from "services/user.service";

const UserRepositoryInstance = new UserRepository(UserModel)
const UserServiceInstance = new UserService(UserRepositoryInstance)
const UserControllerInstance = new UserController(UserServiceInstance)








export {
    UserControllerInstance
}