import { Router } from "express";

const authRouter=Router()

authRouter.post('/signin',(_req,res)=>{
     res.send("hello")
})
authRouter.post('/signup')
authRouter.get('/verify')

export default authRouter