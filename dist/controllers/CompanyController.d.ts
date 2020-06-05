import { NextFunction, Request, Response } from 'express';
export declare class CompanyController {
    getAllCompanies(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    GetOneCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    followCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    unFollowCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    removeTagsCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateCompanyAvatar(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    switchToCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateCompanyCover(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    resetCompanyCover(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    deleteCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
