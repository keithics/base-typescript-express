require('dotenv').config()
import {config} from "./config/config";
import app from './app';
import * as fs from 'fs';

const env = process.env.NODE_ENV || 'development';
const configFile = './config/'+env;
const chalk = require('chalk');
// check if config file is loaded
//if(fs.existsSync(configFile)){
    app.listen(config.PORT, function () {
        var server = (process.env.NODE_ENV === 'secure' ? 'https://' : 'http://') + config.HOST + ':' + config.PORT;
        console.log();
        console.log('--');
        console.log();
        console.log(chalk.yellow('Environment:     ' + env));
        console.log(chalk.magenta('Server:          ' + server));
        console.log(chalk.green('Database:        ' + config.MONGO_URL));
        console.log(chalk.red('Mongo Debug:     ' + config.DEBUG_MONGO));
        console.log();
        console.log('--');
        console.log();
    });

if(!fs.existsSync(configFile)){
     console.log(chalk.red('Config file not found!!! :     ' + configFile));
 }

