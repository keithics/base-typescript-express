// import {NextFunction, Request, Response} from 'express';
// import * as mongoose from 'mongoose';
// import {Deliverie} from '../deliveries/deliverie.model';
// import {Invoice} from '../invoices/invoice.model';
// import {ErrorHandlerController} from "./error.handler.controller";
// import {RequestWithData} from "../interfaces/request.with.data";
// import {BaseResponse, BasicResponse, OkResponse} from '../libraries/basic-response';
// import {Customer} from "../customers/customer.model";
// import {Branche} from "../branches/branche.model";
// import {GlobalPrefs} from "../libraries/GlobalPrefs";
//
// const _ = require('lodash');
//
// export class BaseController{
//
//     protected fields = {};
//     protected limit = 100;
//
//     protected model: typeof mongoose.model;
//     protected populated = [];
//     protected searchKey = 'code';
//     protected showAllUsers = false;
//     protected where = {};
//
//     public count(req: Request, res: Response){
//         this.model.where(this.where).count().exec((err,data)=>{
//             BasicResponse(res,err,data)
//         })
//     }
//
//     public filter(req: Request, res: Response){
//         const {type} = req.params
//        if(type === 'all' || type === 'customers'){
//            const isNewly = type === 'new' ? true : {$ne: false}
//            Customer.find({isNewly}).exec((err,customers)=>{
//                BasicResponse(res,err,customers);
//            })
//        }else{
//            //branches
//            Branche.find({isNewly:true}).exec((err,customers)=>{
//                BasicResponse(res,err,customers);
//            })
//        }
//     }
//
//     public list(req: Request, res: Response){
//         //const showAll = this.showAllUsers ? {} : {user: req.user};
//         const query = this.model.find({},this.fields);
//
//         if(this.populated.length > 0){
//             this.populated.forEach((field)=>{
//                 query.populate(field);
//             })
//         }
//             query.where(this.where).sort({created:-1})
//                 .limit(this.limit)
//                 .exec((err,students)=>{
//             if(err){
//                 return res.status(422).send({
//                     message: ErrorHandlerController.getErrorMessage(err)
//                 });
//             }else{
//                 // console.log(students)
//                 res.jsonp(students);
//             }
//
//         });
//     }
//
//     public paginate(req: Request, res: Response){
//         const {page} = req.body;
//         this.model.paginate(this.where,{page},BaseResponse(res));
//     }
//
//
//     public search(req: Request, res: Response){
//         const key = '^'+req.body.key+'.*';
//         const queryFilter = {} //allow all user search
//         if(req.body.exclude){
//             queryFilter['_id'] = {$nin:[req.body.exclude]}
//         }
//         queryFilter[this.searchKey] = {'$regex': key, $options: 'i'};
//
//         const query = this.model.find(queryFilter ,this.fields);
//         if(this.populated.length > 0){
//             this.populated.forEach((field)=>{
//                 query.populate(field);
//             })
//         }
//         const sort = {};
//         sort[this.searchKey] = 1;
//         query.sort(sort).limit(GlobalPrefs.paginationLimit).exec((err,person)=>{
//             if(err){
//                 return res.status(422).send({
//                     message: ErrorHandlerController.getErrorMessage(err)
//                 });
//             }else{
//                 res.jsonp(person);
//             }
//
//         });
//     }
//
//     /* this method will be called before saving **/
//     public checkAddAndUpdate(callback){
//         callback();
//     }
//
//     public create(req: Request, res: Response){
//         let person = new this.model(req.body);
//         //console.log(person)
//         person.user = req.user;
//         person.save(function(err) {
//             if (err) {
//                 return res.status(422).send({
//                     message: ErrorHandlerController.getErrorMessage(err)
//                 });
//             } else {
//                 res.jsonp(person);
//             }
//         });
//     }
//
//     public read(req: RequestWithData, res: Response){
//         let student = req.modelData ? req.modelData.toJSON() : {};
//
//         res.jsonp(student);
//     }
//
//     public update(req: RequestWithData, res: Response){
//
//         let person = req.modelData;
//         person = _.extend(person, req.body);
//
//         person.save(function (err) {
//             if (err) {
//                 return res.status(422).send({
//                     message: ErrorHandlerController.getErrorMessage(err)
//                 });
//             } else {
//                 res.jsonp(person);
//             }
//         });
//     }
//
//     public delete(req: RequestWithData, res: Response){
//         let person = req.modelData;
//
//         person.remove(function(err) {
//             if (err) {
//                 return res.status(400).send({
//                     message: ErrorHandlerController.getErrorMessage(err)
//                 });
//             } else {
//                 res.jsonp(person);
//             }
//         });
//     }
//
//     public getID(req: RequestWithData, res: Response, next: NextFunction, id: string){
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(422).send({
//                 message: 'Model Data ID is invalid'
//             });
//         }
//
//         const query = this.model.findOne({_id:id}, this.fields);
//
//         if(this.populated.length > 0){
//             this.populated.forEach((field)=>{
//                 query.populate(field);
//             })
//         }
//
//             query.exec(function (err, person) {
//             if (err) {
//                 return next(err);
//             } else if (!person) {
//                 return res.status(404).send({
//                     message: 'No Identifier has been found :: ' + id
//                 });
//             }
//             req.modelData = person;
//             next();
//         });
//
//     }
//
//
//
//
//
// }
