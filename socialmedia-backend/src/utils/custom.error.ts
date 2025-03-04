import { HttpStatus } from "./HttpStatus";

export class CustomError {
    error: string;
    status: number;

    constructor(error: string = "", status= HttpStatus.INTERNAL_SERVER_ERROR) {
        this.error = error;
        this.status = status ;
    }
}