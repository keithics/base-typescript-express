import {Request, Response} from 'express';

export class IndexController{

    public home(req: Request, res: Response){
        res.render('home', { title: 'Hey', message: 'Hello there!' })
    }

}
