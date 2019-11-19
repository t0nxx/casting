import { Request, Response } from 'express';
export declare class ChatController {
    sendMessage(request: any, response: Response, next: any): Promise<import("express-serve-static-core").Response>;
    getAllMessage(request: Request, response: Response): Promise<any>;
}
