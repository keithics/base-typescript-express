const { body, validationResult,check } = require('express-validator')


export class Validator {

    static required(field) {
        return body(field).not().isEmpty().withMessage(field + ' is required')
    }

    static isEmail(field){
        return body(field).isEmail().withMessage(field + ' must be email format')
    }

    static isArray(field){
        return body(field).isArray().withMessage(field + ' must be an array')
    }

    static isIn(field,values){
        return body(field).isIn(values).withMessage(field + ' must be either ' + values.toString())
    }

    static isNumber(field){
        return body(field).isInt().withMessage(field + ' must be a number')
    }

    static minLength(field,length){
        return body(field).isLength({ min: length }).withMessage(field + ' must be at least '+ length+' characters')
    }

    static isValidThaiNumber(field){
        // starts with zero
        // 10 in length
        // must be a number
        // 0812345678
        return body(field)
            .custom( it =>{
                return (it. length === 10 && it.substring(0,1).toString() === '0')
            }).withMessage(field + ' must be in this format 0812345678')
    }

    static minNumber(field,minValue){
        return body(field).custom(val=> val > minValue).withMessage(field + ' must be more than '+ minValue)
    }

    static passwordCombination(field){
        return body(field)
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/, "i")
            .withMessage('Password combination 8 in length with at least one uppercase, lower case and  special character or number. ')

    }

    static validate = (req, res, next) => {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        // errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
        return res.status(422).json({message:errors.array()[0].msg})
    }

}

