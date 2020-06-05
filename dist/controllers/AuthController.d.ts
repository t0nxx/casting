import { Request, Response } from 'express';
export declare class AuthController {
    login(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    adminLogin(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    signUp(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    LoginWithFacebook(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    LoginWithGoogle(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    verifyEmailAndUsernamIsAvailable(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    verifyToken(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    changePassword(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    resetPassword(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    resetPasswordConfirm(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    activateAccount(request: Request, response: Response): Promise<void | import("express-serve-static-core").Response>;
}
