import {ErrorHandlerController} from "../core/error.handler.controller";
import {Helpers} from './Helpers';
import {Error} from "../errors/error.model";


const _ = require('lodash');


export const BaseResponse = function(res,err,data) {

    if(err){
        return ErrorResponse(res,err)
    }else{
        res.json(data)
    }

}

export const OkResponse = function(res) {
     res.json({message:'OK'})
}

export const SuccessResponse = function(res,data) {
     if(data){
         res.json(data)
     }else{
         ErrorResponse(res,{message:'Data is null',code:422})
     }
}

const filterMessage = (err,code) => {
    if(err?.name == 'ValidationError'){
        return {message:ErrorHandlerController.getErrorMessage(err),code:422}
    }
    else if(err?.type === 'http'){
        return err
    }
    else{
        Error.create({error:err})
        const message = err?.message || 'Unknown Server Error Occurred'
        return { message, code}
    }
}

export const ErrorResponse = (res,err)=>{

    try{
        const code = err?.code || 500;
        const errorData = filterMessage(err,code)
        return res.status(errorData.code).send(errorData);
    }catch (e) {
        return res.status(500).send({
            message: 'Server Error Occurred'
        });
    }

}



