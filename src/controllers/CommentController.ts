import { getRepository, In } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/auth_user';
import { Profile } from '../models/users_profile';
import { Comment } from '../models/comments';
import { ApplyPagination } from '../helpers/pagination';
import { Activity } from '../models/activity';

export class CommentController {

    async getAllCommentsOfACtivity(request: Request, response: Response) {
        // this without replies
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const CommentRepository = getRepository(Comment);
        try {
            const q = await CommentRepository.createQueryBuilder('c')
                .innerJoin('c.profile', 'profile')
                .leftJoin('c.commentMention', 'commentMention')
                .leftJoin('c.thread', 'thread')
                .addSelect(['profile.id', 'profile.slug', 'commentMention.id', 'commentMention.slug', 'thread.id'])
                .where(`c.activityId = ${request.params.id}`)
                .andWhere(`c.threadId is null`)
                .orderBy('c.id', 'DESC');


            const responseObject = await ApplyPagination(request, response, q, false);

            // const responseObject: any = {};
            responseObject.results = await Promise.all(responseObject.results.map(async e => {
                let comment_mention = [];
                comment_mention = await Promise.all(e.commentMention.map(async p => {
                    const mentioned = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: mentioned.user.first_name,
                            last_name: mentioned.user.last_name,
                            slug: mentioned.slug,
                        }
                    }
                })
                ).then(rez => rez);
                const commenterProfile = await profileRepository.findOne({ id: e.profile.id }, {
                    relations: ['user'],
                    select: ['id', 'avatar', 'user', 'slug']
                })
                const auth_user = {
                    pk: commenterProfile.id,
                    first_name: commenterProfile.user.first_name,
                    last_name: commenterProfile.user.last_name,
                    email: commenterProfile.user.email,
                    username: commenterProfile.user.username,
                    slug: commenterProfile.slug,
                    avatar: commenterProfile.avatar,
                }
                delete e.commentMention;
                delete e.profile;

                if (e.thread) {
                    e.thread = e.thread.id;
                }

                return {
                    ...e, auth_user, comment_mention,
                }

            })).then(rez => rez);

            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async getAllRepliesOfComment(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const CommentRepository = getRepository(Comment);
        try {
            const q = await CommentRepository.createQueryBuilder('c')
                .innerJoin('c.profile', 'profile')
                .leftJoin('c.commentMention', 'commentMention')
                .leftJoin('c.thread', 'thread')
                .addSelect(['profile.id', 'profile.slug', 'commentMention.id', 'commentMention.slug', 'thread.id'])
                .where(`c.threadId = ${request.params.comId}`)
                .orderBy('c.id', 'DESC');


            const responseObject = await ApplyPagination(request, response, q, false);

            // const responseObject: any = {};
            responseObject.results = await Promise.all(responseObject.results.map(async e => {
                let comment_mention = [];
                comment_mention = await Promise.all(e.commentMention.map(async p => {
                    const mentioned = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: mentioned.user.first_name,
                            last_name: mentioned.user.last_name,
                            slug: mentioned.slug,
                        }
                    }
                })
                ).then(rez => rez);
                const commenterProfile = await profileRepository.findOne({ id: e.profile.id }, {
                    relations: ['user'],
                    select: ['id', 'avatar', 'user', 'slug']
                })
                const auth_user = {
                    pk: commenterProfile.id,
                    first_name: commenterProfile.user.first_name,
                    last_name: commenterProfile.user.last_name,
                    email: commenterProfile.user.email,
                    username: commenterProfile.user.username,
                    slug: commenterProfile.slug,
                    avatar: commenterProfile.avatar,
                }
                delete e.commentMention;
                delete e.profile;

                if (e.thread) {
                    e.thread = e.thread.id;
                }

                return {
                    ...e, auth_user, comment_mention,
                }

            })).then(rez => rez);

            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async createComment(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const CommentRepository = getRepository(Comment);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('activivty not found'); }

            if (!request.body.comment) { throw new Error("you can't add empty comment"); }
            const newComment = new Comment();
            newComment.comment = request.body.comment;
            newComment.profile = profile;
            newComment.activity = activity;
            if (request.body.thread) {
                const thread = await CommentRepository.findOne({ id: parseInt(request.body.thread, 10) });
                if (thread) {
                    newComment.thread = thread;
                    thread.comments_count = thread.comments_count + 1;
                    await CommentRepository.save(thread);
                    // cause it will be increased in every comment even if it reply
                    activity.comments_count = activity.comments_count - 1;
                }
            }
            const mentions: any = [];
            if (request.body.mentions) {
                request.body.mentions.forEach(element => {
                    mentions.push(element.auth_user);
                });
                if (mentions.length > 0) {
                    const users = await profileRepository.find({ where: { id: In(mentions) } });
                    newComment.commentMention = [...users];
                }
            }
            activity.comments_count = activity.comments_count + 1;
            await ActivityRepository.save(activity);
            const save = await CommentRepository.save(newComment);
            const getAfterSave = await CommentRepository.findOne({ id: save.id },
                {
                    relations: ['profile', 'commentMention', 'thread']
                });
            const responseObject: any = {};
            // to ensure that it always returned to the front 
            responseObject.comment_mention = [];
            responseObject.comment_mention = await Promise.all(getAfterSave.commentMention.map(async p => {
                const mentioned = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                return {
                    auth_user: {
                        first_name: mentioned.user.first_name,
                        last_name: mentioned.user.last_name,
                        slug: mentioned.slug,
                    }
                }
            })
            ).then(rez => rez);
            delete getAfterSave.profile;
            delete getAfterSave.commentMention;

            responseObject.auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }
            return response.status(200).send({ ...getAfterSave, ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async updateComment(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const CommentRepository = getRepository(Comment);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const comment = await CommentRepository.findOne({ id: parseInt(request.params.comId, 10) }, {
                relations: ['profile', 'commentMention', 'thread']
            });
            comment.comment = request.body.comment;
            const mentions: any = [];
            if (request.body.mentions) {
                request.body.mentions.forEach(element => {
                    mentions.push(element.auth_user);
                });
                if (mentions.length > 0) {
                    const users = await profileRepository.find({ where: { id: In(mentions) } });
                    comment.commentMention = [...comment.commentMention, ...users];
                }
            }
            const save = await CommentRepository.save(comment);
            const getAfterSave = await CommentRepository.findOne({ id: save.id },
                {
                    relations: ['profile', 'commentMention', 'thread']
                });
            const responseObject: any = {};
            // to ensure that it always returned to the front 
            responseObject.comment_mention = [];
            responseObject.comment_mention = await Promise.all(getAfterSave.commentMention.map(async p => {
                const mentioned = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                return {
                    auth_user: {
                        first_name: mentioned.user.first_name,
                        last_name: mentioned.user.last_name,
                        slug: mentioned.slug,
                    }
                }
            })
            ).then(rez => rez);
            delete getAfterSave.profile;
            delete getAfterSave.commentMention;

            responseObject.auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }
            return response.status(200).send({ ...getAfterSave, ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

    async removeComment(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const CommentRepository = getRepository(Comment);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const comment = await CommentRepository.findOne({ id: parseInt(request.params.comId, 10) }, {
                relations: ['activity']
            });
            comment.activity.comments_count = comment.activity.comments_count - 1;
            await CommentRepository.save(comment);
            await CommentRepository.remove(comment);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }



}