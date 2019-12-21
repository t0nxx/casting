import { NextFunction, Request, Response } from 'express';
export declare class NewsLetterController {
    getAllNewsLetterUsers(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    subscribeToNewsLetter(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    inviteToCasting(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
