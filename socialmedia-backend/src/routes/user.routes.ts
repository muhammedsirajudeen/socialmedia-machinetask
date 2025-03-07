import upload from "@config/multerConfig";
import { PostControllerInstance as PostController, UserControllerInstance } from "di/config";
import { Router } from "express";
import { UserMiddleware } from "middleware/user.middleware";
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
userRouter.get('/posts/:id',UserMiddleware,PostController.GetPostsByUser.bind(PostController))
userRouter.get('/post/:id',UserMiddleware,PostController.GetPost.bind(PostController))
userRouter.get('/posts',UserMiddleware,PostController.GetAllPosts.bind(PostController))

userRouter.put('/post/comment/:id',UserMiddleware,PostController.AddComments.bind(PostController))
userRouter.delete('/post/comment/:postId/:commentId',UserMiddleware,PostController.RemoveComment.bind(PostController))

userRouter.put('/profile/:id',UserMiddleware,UserControllerInstance.UpdateProfile.bind(UserControllerInstance))

userRouter.put('/follow/:id',UserMiddleware,UserControllerInstance.FollowSomeone.bind(UserControllerInstance))
userRouter.put('/unfollow/:id',UserMiddleware,UserControllerInstance.UnfollowSomeone.bind(UserControllerInstance))

// get profile details
userRouter.get('/profile/:id',UserMiddleware,UserControllerInstance.GetProfile.bind(UserControllerInstance))

userRouter.post('/uploads',UserMiddleware,upload.array('images'),UserControllerInstance.Uploads)

export default userRouter