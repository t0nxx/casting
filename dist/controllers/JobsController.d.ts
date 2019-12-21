import { NextFunction, Request, Response } from 'express';
export declare class JobsController {
    getAllJobs(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getOneJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getOneJobForNotLOgin(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    deleteJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    applyJob(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getApplicants(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getShortListed(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getInterviews(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    addApplicantsToShortList(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    removeApplicantFromShortList(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createInterviewForapplicants(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
