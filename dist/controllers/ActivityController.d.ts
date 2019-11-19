import { Request, Response } from 'express';
export declare class ActivityController {
    getAllActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getActivityOfUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllBookmarkedActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    AddNewActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    LikeActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    DisLikeActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    BookmarkActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    HideActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    UpdateMediaToActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
}
