// import { UserControllerInstance } from "di/config";
import { PostControllerInstance as PostController } from "di/config";
import { Router } from "express";
import { UserMiddleware } from "middleware/user.middleware";
// import { UserMiddleware } from "@middleware";

const userRouter = Router()
/*
    TODO:
    create the post model and then complete this particular part
*/
userRouter.post('/post',UserMiddleware,PostController.createPost.bind(PostController))
userRouter.put('/post/:id',UserMiddleware,PostController.updatePost.bind(PostController))
userRouter.delete('/post/:id',UserMiddleware,PostController.deletePost.bind(PostController))
userRouter.put('/post/like/:id',UserMiddleware,PostController.likeAPost.bind(PostController))
userRouter.put('/post/dislike/:id',UserMiddleware,PostController.dislikeAPost.bind(PostController))
userRouter.get('/post',UserMiddleware,PostController.GetPostsByUser.bind(PostController))
userRouter.get('/post/:id',UserMiddleware,PostController.GetPost.bind(PostController))

userRouter.put('/post/comment/:id',UserMiddleware,PostController.AddComments.bind(PostController))

export default userRouter