import { NextFunction, Request, Response } from 'express';
export declare class RandomJobsAndUsersController {
    getRandomJobs(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getRandomUsers(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
