import {NextFunction, Request, Response} from 'express';


export class Logger{

    public static log(req: Request, res: Response, next: NextFunction){
        console.log(req.method,req.originalUrl)
        console.log(JSON.stringify(req.body, null, 4))

        next();
    }


}
