const bcrypt = require('bcrypt');
import * as _ from 'lodash';
import * as moment from 'moment-timezone'
import {GlobalPrefs} from "./GlobalPrefs";
import * as numeral from 'numeral';

export const padString = (s, length = 2) => {
    while (s.toString().length < length) {
        s = '0' + s;
    }
    return s;
};


export class Helpers{

    public static currentDateTime(){
        return moment.utc()
    }

    public static randomString(length = 12, prefix = '') {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return prefix + result;
    }

    public static randomNumber(length = 12) {
        var result           = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    public static getCurrentTimeInThailand(){
        console.log(moment.tz("Asia/Bangkok").format())
        console.log('=====current time in bangkok=======')
        return moment.tz("Asia/Bangkok").format()
    }


    public static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static prettyPrint (obj){
        return console.log(JSON.stringify(obj, null, 2))
    }

    public static log (obj){
        return console.log(JSON.stringify(obj, null, 2))
    }

    public static money(value){
        return '฿ ' + numeral(value).format('0,0.00');
    }

    // return callback error if value is empty
    public static emptyValueError = function (message, value, callback) {
        const cc = _.isEmpty(value) ? message : null;
        callback(cc, value)
    }

    // return callback error if value is set
    public static withValueError = function (message, value, callback) {
        const cc = value ? message : null;
        callback(cc, value)
    }

    public static generateError(errString,code = 500){
        return {message:errString,code}
    }

    public static returnReject(message){
        return new Promise((resolve, reject)=>{
            reject(message)
        })
    }

    public static returnResolve(message){
        return new Promise((resolve, reject)=>{
            resolve(message)
        })
    }

    public static async generateSalt(password){
        return new Promise(function(resolve, reject) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hashedPassword) {
                     if (err) { return reject(Helpers.generateError(err)); }
                     resolve({hashedPassword,salt})

                });
            });
        })


    }

}
