import * as mongoose from 'mongoose';
import * as validator from 'validator';

const Schema = mongoose.Schema;

/**
 * A Validation function for local strategy email
 */
const validateLocalStrategyEmail = function (email) {
    return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email, { require_tld: false }));
};


export const BaseSchema = new Schema({
    name: {
        type: String,
        trim: true,
        default: ''
    },
    created: {
        type: Date,
        default: Date.now()
    }
});

