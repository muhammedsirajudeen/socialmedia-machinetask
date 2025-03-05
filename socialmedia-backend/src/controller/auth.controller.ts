import { NextFunction, Request, Response } from "express";
import { IUser } from "@models/user.model";
import { UserService } from "services/user.service";
import { HttpStatus } from "@utils/HttpStatus";
import { ExpiryOptions, TokenGenerator, TokenVerification } from "@utils/token.helper";
import { CustomError } from "@utils/custom.error";

export class AuthController {
    service: UserService
    constructor(service: UserService) {
        this.service = service
    }
    async Signup(req: Request, res: Response, next: NextFunction) {
        try {
            const userRequest: IUser = req.body
            const user = await this.service.create(userRequest)
            //honestly we do need DTO's here
            res.status(HttpStatus.CREATED).json({ message: HttpStatus.CREATED, user: { ...user.toObject(), password: undefined } })
        } catch (err) {
            next(err)
        }
    }
    async Signin(req: Request, res: Response, next: NextFunction) {
        try {
            const userRequest: IUser = req.body
            const user = await this.service.verifyPassword(userRequest)
            const accessToken = TokenGenerator({ ...user.toObject(), password: undefined }, ExpiryOptions.access)
            const refreshToken = TokenGenerator({ ...user.toObject(), password: undefined }, ExpiryOptions.refresh)
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })
            res.status(HttpStatus.OK).json({ message: HttpStatus.OK, user: { ...user.toObject(), password: undefined }, accessToken })
        } catch (error) {
            next(error)
        }
    }

    async VerifyToken(req: Request, res: Response, next: NextFunction) {
        try {
            const access_token = req.headers.authorization
            if (!access_token) {
                throw new CustomError("Access token not attached", HttpStatus.UNAUTHORIZED)
            }
            const decodedUser = TokenVerification(access_token.split(' ')[1])
            if (!decodedUser) {
                throw new CustomError("Access token not attached", HttpStatus.UNAUTHORIZED)
            }
            res.status(HttpStatus.OK).json({ message: HttpStatus.OK, user: decodedUser })
        } catch (error) {
            next(error)
        }
    }

}