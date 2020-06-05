import { NextFunction, Request, Response } from 'express';
export declare class ActivityController {
    getActivityOfUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getActivityOfCompany(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getOneActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllBookmarkedActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    AddNewActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    AddNewActivityToCompany(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    LikeActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    DisLikeActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    BookmarkActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    reportActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    HideActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    UpdateMediaToActivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllActivityTest(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    AddNewVideoOrAudio(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllVideoOfUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllAudioOfUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllImagesOfUser(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllImagesOfAlbum(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    addImageToAlbum(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    reomveImageFromAlbum(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    deleteActivity(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
