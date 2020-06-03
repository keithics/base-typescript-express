import {_} from 'lodash';

export class ErrorHandlerController {

    private static getUniqueErrorMessage (err: any) {
        var output;

        try {
            var fieldName = err.errmsg.substring(err.errmsg.lastIndexOf('.$') + 2, err.errmsg.lastIndexOf('_1'));
            output = fieldName.charAt(0).toUpperCase() + fieldName.slice(1) + ' already exists';

        } catch (ex) {
            output = 'Unique field already exists';
        }

        return output;
    };

    public static getErrorMessage(err: any) {
        var message = '';
        console.log(err)
        if (!err.code) {
            message = 'Something went wrong (12)';
        }
        if (err.code) {
            switch (err.code) {
                case 11000:
                    message = this.getUniqueErrorMessage(err);
                    break;
                case 11001:
                    message = this.getUniqueErrorMessage(err);
                    break;
                case 10000:
                    message = err.message;
                    break;
                default:
                    message = 'Something went wrong';
            }
        } else {
            for (var errName in err.errors) {
                if (err.errors[errName].message) {
                    message = _.startCase(err.errors[errName].message.replace('Path ',''));
                }
            }
        }

        return message;
    };



}

