import { Request, Response } from 'express';
export declare class ChatController {
    sendMessage(request: any, response: Response, next: any): Promise<import("express-serve-static-core").Response>;
    getAllMessage(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getChats(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    muteChatRoom(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    unMuteChatRoom(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    clearChatFromRoom(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    checkIfRoomExistOrCreateNewRoom(request: any, response: Response, next: any): Promise<import("express-serve-static-core").Response>;
}
