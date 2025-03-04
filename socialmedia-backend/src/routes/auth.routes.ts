import { UserControllerInstance } from "di/config";
import { Router } from "express";

const authRouter=Router()

authRouter.post('/signup',UserControllerInstance.Signup.bind(UserControllerInstance))
authRouter.post('/signin')
authRouter.get('/verify')

export default authRouter