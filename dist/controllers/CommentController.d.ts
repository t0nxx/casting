import { Request, Response } from 'express';
export declare class CommentController {
    getAllCommentsOfACtivity(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    getAllRepliesOfComment(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    createComment(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    updateComment(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
    removeComment(request: Request, response: Response): Promise<import("express-serve-static-core").Response>;
}
