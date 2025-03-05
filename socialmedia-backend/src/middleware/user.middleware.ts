import { CustomError } from "@utils/custom.error";
import { HttpMessage, HttpStatus } from "@utils/HttpStatus";
import { TokenVerification } from "@utils/token.helper";
import { Request, Response, NextFunction } from "express";
function UserMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const authorization = req.headers.authorization
        if (!authorization) {
            throw new CustomError(HttpMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }
        const decodedUser = TokenVerification(authorization.split(' ')[1])
        if (!decodedUser) {
            throw new CustomError(HttpMessage.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
        }
        req.user = decodedUser
        next()
    } catch (error) {
        next(error)
    }
}



export {
    UserMiddleware
}