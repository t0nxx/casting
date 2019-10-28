import { NextFunction, Request, Response } from 'express';
export declare class JobsController {
    getAllJobs(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getOneJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
