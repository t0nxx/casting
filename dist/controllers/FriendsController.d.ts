import { Request, Response } from 'express';
export declare class FriendsController {
    sendFriendRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    acceptFriendRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    rejectFriendRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    deleteFriend(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllFriendsRequest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllFriends(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
}
