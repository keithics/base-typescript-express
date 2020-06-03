import {NextFunction, Request, Response} from 'express';
import * as mongoose from 'mongoose';
import {ErrorHandlerController} from "./error.handler.controller";
import {RequestWithData} from "../interfaces/request.with.data";

const _ = require('lodash');


export class BasePersonController{

    protected fields = {};

    protected model: typeof mongoose.model;
    protected populated = [];

    public list(req: Request, res: Response){
        const query = this.model.find({roles:{$in:[req.params.type]}, user: req.user},this.fields);
        if(this.populated.length > 0){
            this.populated.forEach((field)=>{
                query.populate(field);
            })
        }
            query.exec((err,students)=>{
            if(err){
                return res.status(422).send({
                    message: ErrorHandlerController.getErrorMessage(err)
                });
            }else{
                res.jsonp(students);
            }

        });
    }

    public search(req: Request, res: Response){
        this.model.find({roles:{$in:[req.params.type]}},this.fields).exec((err,person)=>{
            if(err){
                return res.status(422).send({
                    message: ErrorHandlerController.getErrorMessage(err)
                });
            }else{
                res.jsonp(person);
            }

        });
    }

    public create(req: Request, res: Response){
        let person = new this.model(req.body);
        person.user = req.user;
        person.roles = [req.params.type];

        person.save(function(err) {
            if (err) {
                return res.status(422).send({
                    message: ErrorHandlerController.getErrorMessage(err)
                });
            } else {
                res.jsonp(person);
            }
        });
    }

    public read(req: RequestWithData, res: Response){
        let student = req.modelData ? req.modelData.toJSON() : {};

        res.jsonp(student);
    }

    public update(req: RequestWithData, res: Response){
        let person = req.modelData;
        person = _.extend(person, req.body);

        person.save(function (err) {
            if (err) {
                return res.status(422).send({
                    message: ErrorHandlerController.getErrorMessage(err)
                });
            } else {
                res.jsonp(person);
            }
        });
    }

    public delete(req: RequestWithData, res: Response){
        let person = req.modelData;

        person.remove(function(err) {
            if (err) {
                return res.status(400).send({
                    message: ErrorHandlerController.getErrorMessage(err)
                });
            } else {
                res.jsonp(person);
            }
        });
    }

    public getID(req: RequestWithData, res: Response, next: NextFunction, id: string){
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(422).send({
                message: 'Model Data ID is invalid'
            });
        }

        const query = this.model.findOne({_id:id, user: req.user}, this.fields);

        if(this.populated.length > 0){
            this.populated.forEach((field)=>{
                query.populate(field);
            })
        }

            query.exec(function (err, person) {
            if (err) {
                return next(err);
            } else if (!person) {
                return res.status(404).send({
                    message: 'No Identifier has been found'
                });
            }
            req.modelData = person;
            next();
        });

    }


}
