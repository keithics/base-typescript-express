import {Request, Response} from 'express';
import * as   Resize from '../libraries/Resize';

export class UploadController{

    public process(req: Request, res: Response){
            Resize.resize(req, res,req.params.type); // products1..products5 = products
    }

    public processBase64(req: Request, res: Response){
            Resize.base64Image(req, res); // products1..products5 = products
    }
}
