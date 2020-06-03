import {NextFunction, Request, Response} from "express";
import "./config/passport";
import * as passport from "passport";

const _ = require('lodash');

export const register = (req: Request, res: Response, next: NextFunction) => {
    const {email,deviceId,password} = req.body;
    if(_.compact([email,deviceId,password]).length < 3){
        return res.status(422).send({message:"all fields are required"})
    }

    next()


}

export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function (err, user, info) {
        if (err || !user) {
            res.status(422).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    res.status(422).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);

}

export const loginAdmin = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('admin', function (err, user, info) {
        if (err || !user) {
            res.status(422).send(info);
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    res.status(422).send(err);
                } else {
                    res.json(user);
                }
            });
        }
    })(req, res, next);

}
