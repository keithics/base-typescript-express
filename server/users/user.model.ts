import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as moment from 'moment-timezone'
import {config} from "../config/config";

export const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    isGuest: {
        type: Boolean,
        default: false
    },
    username: {
        type:String,
        unique:true
    },
    email: {
        type:String,
        unique:true
    },
    phone: {
        type:String,
        unique:true
    },
    status:{
        type: String,
        enum: ['inactive', 'active'],
        default:'active'
    },
    salt: {
        type: String,
        required: true
    },
    password: String,
    token: String,
    tokens: [String],
    created:{
        type: Date,
        default:Date.now()
    },
    tokenExpireDate:Date

});


UserSchema.pre('save',function (next) {
    next();
})


export const User = mongoose.model('User', UserSchema);
