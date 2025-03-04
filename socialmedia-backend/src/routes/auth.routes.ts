import { UserControllerInstance } from "di/config";
import { Router } from "express";

const authRouter=Router()

authRouter.post('/signup',UserControllerInstance.Signup.bind(UserControllerInstance))
authRouter.post('/signin',UserControllerInstance.Signin.bind(UserControllerInstance))
authRouter.get('/verify',UserControllerInstance.VerifyToken.bind(UserControllerInstance))

export default authRouter