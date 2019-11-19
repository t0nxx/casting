import { NextFunction, Request, Response } from 'express';
export declare class ProfileController {
    all(request: Request, response: Response, next: NextFunction): Promise<void>;
    getProfile(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getProfileSettings(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getProfileAlbums(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getLookups(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateProfile(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateCover(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    resetCover(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateAvatar(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateProfileSettings(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    addHobbies(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    addTaninig(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    addSocialNetwork(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateTaninig(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    updateSocialNetwork(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    deleteTaninig(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    deleteHobbies(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
