import { NextFunction, Response } from 'express';
export declare class SearchController {
    searchJobs(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    searchCompaines(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    searchPeople(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    searchPeopleLandingPage(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getWhoSeeMePeople(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    searchMYFollowedCompaines(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getSuitesMeJobs(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getMyAppliedJobs(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
