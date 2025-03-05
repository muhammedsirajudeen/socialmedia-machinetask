import { AuthControllerInstance } from "di/config";
import { Router } from "express";

const authRouter = Router()

authRouter.post('/signup', AuthControllerInstance.Signup.bind(AuthControllerInstance))
authRouter.post('/signin', AuthControllerInstance.Signin.bind(AuthControllerInstance))
authRouter.get('/verify', AuthControllerInstance.VerifyToken.bind(AuthControllerInstance))

export default authRouter