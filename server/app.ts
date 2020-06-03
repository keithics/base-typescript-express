import * as express from "express";
import * as helmet from "helmet";
import * as bodyParser from "body-parser";
import * as methodOverride from "method-override";
import {IndexRoutes} from "./core/index.routes";
import * as mongoose from "mongoose";
import * as cors from "cors";
import {UploadRoutes} from "./core/upload.routes";
import {AuthenticationMiddleware} from "./auth/authentication.middleware";
import {Logger} from "./libraries/Logger";
import {AuthenticationRoutes} from "./auth/authentication.routes";
import * as passport from "passport";
import {config} from "./config/config";
import * as path from "path";

const  session = require('express-session')
class App {

    public app: express.Application = express();
    public authenticationMiddleware: AuthenticationMiddleware = new AuthenticationMiddleware()

    // routes
    public indexRoutes: IndexRoutes = new IndexRoutes();
    public uploadRoutes: UploadRoutes = new UploadRoutes();
    public authenticationRoutes: AuthenticationRoutes = new AuthenticationRoutes();

    setupRoutes(){
        this.indexRoutes.routes(this.app);
        this.uploadRoutes.routes(this.app);
        this.authenticationRoutes.routes(this.app);
    }

    constructor() {
        this.config();
        this.mongoSetup();
        this.setupRoutes();
    }

    private config(): void{
        this.app.use(helmet())
            // Require static assets from public folder
        this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug')
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.set('trust proxy', 1) // trust first proxy
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(express.static('public'));
        this.app.use(methodOverride())
        this.app.use(this.authenticationMiddleware.authenticate.bind(this.authenticationMiddleware));
        this.app.use(Logger.log);
         //this.app.use(errorMiddleware);
    }

    private mongoSetup(): void{
        mongoose.Promise = require('bluebird');
        mongoose.set('debug', config.DEBUG_MONGO);
        mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useCreateIndex:true, autoIndex: true});
    }

}

export default new App().app;
