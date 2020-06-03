
import {GlobalPrefs} from "../libraries/GlobalPrefs";

var mongoosePaginate = require('mongoose-paginate-v2');
const fs = require('fs');
const env = process.env.NODE_ENV || 'development';

const configFile = '../config/'+env+'/config';

export const config =  require(configFile);


mongoosePaginate.paginate.options = {
    limit: GlobalPrefs.paginationLimit
};
