import { NextFunction, Request, Response } from 'express';
export declare class AdminLookupsController {
    getAllTemplate(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getOneTemplate(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createNewTemplate(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateOneTemplate(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    deleteOneTemplate(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
