import {NextFunction, Request, Response} from 'express';
import HttpException from '../exceptions/HttpException';

function errorMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    response.status(500)
    response.render('error', { error: error })
}

export default errorMiddleware;
