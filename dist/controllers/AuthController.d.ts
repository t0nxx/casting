import { Request, Response } from 'express';
export declare class AuthController {
    login(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    signUp(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    changePassword(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
}
