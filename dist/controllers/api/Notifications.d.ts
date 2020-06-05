import { NextFunction, Request, Response } from 'express';
export declare class NotificationsController {
    getAllNotifications(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getCountOfNewAndNotRead(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    makeNotificationRead(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    makeAllNotificationsRead(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    addNotificationsFromAdmin(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getAllNotificationsForAdmin(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    getOneNotificationsForAdmin(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
