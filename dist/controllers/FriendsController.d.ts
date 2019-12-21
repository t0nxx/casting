import { NextFunction, Request, Response } from 'express';
export declare class FriendsController {
    sendFriendRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    acceptFriendRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    rejectFriendRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    deleteFriend(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllFriendsRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllFriends(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getSuggestedFriends(request: any, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
export declare function getAllFriendSharedBtwnApp(request: any, response: Response, slug: any): Promise<import("express-serve-static-core").Response | {
    pk: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    avatar: string;
    slug: string;
    room: string;
}[]>;
