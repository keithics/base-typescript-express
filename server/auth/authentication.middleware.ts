import {NextFunction, Request, Response} from 'express';
import {User} from '../users/user.model'

export class AuthenticationMiddleware {

    isProtected = (url) => {
        const protectedRoutes = ['admin']
        return protectedRoutes.indexOf(url) > -1
    }

    private authenticateWeb(res,req, next, token){
        const roles = ['admin']
        User.findOne({
            token, roles:{$in:roles}
        }, '-salt -storeCode -password').exec((err, user) => {
            if (err) {
                return res.status(500).send(err)
            } else if (!user) {
                return res.status(401).send({message :'API User not authenticated, error: 401'})
            } else {
                req.user = user;
                next();
            }
        })
    }

    public authenticate(req: Request, res: Response, next: NextFunction){
        const token = req.headers['x-user-token'] || 'faketoken';
        console.log('authenticating..')
        console.log('===============')
        console.log(req.url)
        if(this.isProtected(req.url)){
                this.authenticateWeb(res,req, next, token);
        } else {
            next();
        }

    }

}

