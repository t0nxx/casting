import { NextFunction, Request, Response } from 'express';
export declare class TalentCategoriesController {
    getAllTalentCategories(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
    createNewCategory(request: Request, response: Response, next: NextFunction): Promise<import("express-serve-static-core").Response>;
}
