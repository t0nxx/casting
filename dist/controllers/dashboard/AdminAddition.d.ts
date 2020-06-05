import { Request, Response } from 'express';
export declare class AdminAdditionController {
    getAllUsers(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getOneUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    updateUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    deleteUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getActivityReports(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    deleteReportedActivityFromAdmin(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
}
