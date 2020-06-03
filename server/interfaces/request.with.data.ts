import {Request} from "express";

export interface RequestWithData extends Request {
    modelData?: any;
}
