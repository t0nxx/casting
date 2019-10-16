import { NextFunction, Request, Response } from 'express';
export declare class ProfileController {
    all(request: Request, response: Response, next: NextFunction): Promise<void>;
    getProfile(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getProfileSettings(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateProfile(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
