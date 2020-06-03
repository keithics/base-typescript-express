import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as moment from 'moment-timezone'
import {config} from "../config/config";

export const ErrorSchema = new Schema({
    error:{},
    created:{
        type: Date,
        default:Date.now()
    }

});



ErrorSchema.pre('save',function (next) {
    next();
})


export const Error = mongoose.model('Error', ErrorSchema);
