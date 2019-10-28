import { NextFunction, Request, Response } from 'express';
export declare class CompanyController {
    getAllCompanies(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    GetOneCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createCompany(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
