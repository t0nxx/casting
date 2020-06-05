"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const users_profile_1 = require("../models/users_profile");
const comments_1 = require("../models/comments");
const pagination_1 = require("../helpers/pagination");
const activity_1 = require("../models/activity");
class CommentController {
    getAllCommentsOfACtivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const CommentRepository = typeorm_1.getRepository(comments_1.Comment);
            try {
                const q = yield CommentRepository.createQueryBuilder('c')
                    .innerJoin('c.profile', 'profile')
                    .leftJoin('c.commentMention', 'commentMention')
                    .leftJoin('c.thread', 'thread')
                    .addSelect(['profile.id', 'profile.slug', 'commentMention.id', 'commentMention.slug', 'thread.id'])
                    .where(`c.activityId = ${request.params.id}`)
                    .andWhere(`c.threadId is null`)
                    .orderBy('c.id', 'DESC');
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                responseObject.results = yield Promise.all(responseObject.results.map((e) => __awaiter(this, void 0, void 0, function* () {
                    let comment_mention = [];
                    comment_mention = yield Promise.all(e.commentMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        const mentioned = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: mentioned.user.first_name,
                                last_name: mentioned.user.last_name,
                                slug: mentioned.slug,
                            }
                        };
                    }))).then(rez => rez);
                    const commenterProfile = yield profileRepository.findOne({ id: e.profile.id }, {
                        relations: ['user'],
                        select: ['id', 'avatar', 'user', 'slug']
                    });
                    const auth_user = {
                        pk: commenterProfile.id,
                        first_name: commenterProfile.user.first_name,
                        last_name: commenterProfile.user.last_name,
                        email: commenterProfile.user.email,
                        username: commenterProfile.user.username,
                        slug: commenterProfile.slug,
                        avatar: commenterProfile.avatar,
                    };
                    delete e.commentMention;
                    delete e.profile;
                    if (e.thread) {
                        e.thread = e.thread.id;
                    }
                    return Object.assign(Object.assign({}, e), { auth_user, comment_mention });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getAllRepliesOfComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const CommentRepository = typeorm_1.getRepository(comments_1.Comment);
            try {
                const q = yield CommentRepository.createQueryBuilder('c')
                    .innerJoin('c.profile', 'profile')
                    .leftJoin('c.commentMention', 'commentMention')
                    .leftJoin('c.thread', 'thread')
                    .addSelect(['profile.id', 'profile.slug', 'commentMention.id', 'commentMention.slug', 'thread.id'])
                    .where(`c.threadId = ${request.params.comId}`)
                    .orderBy('c.id', 'DESC');
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                responseObject.results = yield Promise.all(responseObject.results.map((e) => __awaiter(this, void 0, void 0, function* () {
                    let comment_mention = [];
                    comment_mention = yield Promise.all(e.commentMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        const mentioned = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: mentioned.user.first_name,
                                last_name: mentioned.user.last_name,
                                slug: mentioned.slug,
                            }
                        };
                    }))).then(rez => rez);
                    const commenterProfile = yield profileRepository.findOne({ id: e.profile.id }, {
                        relations: ['user'],
                        select: ['id', 'avatar', 'user', 'slug']
                    });
                    const auth_user = {
                        pk: commenterProfile.id,
                        first_name: commenterProfile.user.first_name,
                        last_name: commenterProfile.user.last_name,
                        email: commenterProfile.user.email,
                        username: commenterProfile.user.username,
                        slug: commenterProfile.slug,
                        avatar: commenterProfile.avatar,
                    };
                    delete e.commentMention;
                    delete e.profile;
                    if (e.thread) {
                        e.thread = e.thread.id;
                    }
                    return Object.assign(Object.assign({}, e), { auth_user, comment_mention });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    createComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const CommentRepository = typeorm_1.getRepository(comments_1.Comment);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                if (!request.body.comment) {
                    throw new Error("you can't add empty comment");
                }
                const newComment = new comments_1.Comment();
                newComment.comment = request.body.comment;
                newComment.profile = profile;
                newComment.activity = activity;
                if (request.body.thread) {
                    const thread = yield CommentRepository.findOne({ id: parseInt(request.body.thread, 10) });
                    if (thread) {
                        newComment.thread = thread;
                        thread.comments_count = thread.comments_count + 1;
                        yield CommentRepository.save(thread);
                        activity.comments_count = activity.comments_count - 1;
                    }
                }
                const mentions = [];
                if (request.body.mentions) {
                    request.body.mentions.forEach(element => {
                        mentions.push(element.auth_user);
                    });
                    if (mentions.length > 0) {
                        const users = yield profileRepository.find({ where: { id: typeorm_1.In(mentions) } });
                        newComment.commentMention = [...users];
                    }
                }
                activity.comments_count = activity.comments_count + 1;
                yield ActivityRepository.save(activity);
                const save = yield CommentRepository.save(newComment);
                const getAfterSave = yield CommentRepository.findOne({ id: save.id }, {
                    relations: ['profile', 'commentMention', 'thread']
                });
                const responseObject = {};
                responseObject.comment_mention = [];
                responseObject.comment_mention = yield Promise.all(getAfterSave.commentMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                    const mentioned = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: mentioned.user.first_name,
                            last_name: mentioned.user.last_name,
                            slug: mentioned.slug,
                        }
                    };
                }))).then(rez => rez);
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
                };
                return response.status(200).send(Object.assign(Object.assign({}, getAfterSave), responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const CommentRepository = typeorm_1.getRepository(comments_1.Comment);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const comment = yield CommentRepository.findOne({ id: parseInt(request.params.comId, 10) }, {
                    relations: ['profile', 'commentMention', 'thread']
                });
                comment.comment = request.body.comment;
                const mentions = [];
                if (request.body.mentions) {
                    request.body.mentions.forEach(element => {
                        mentions.push(element.auth_user);
                    });
                    if (mentions.length > 0) {
                        const users = yield profileRepository.find({ where: { id: typeorm_1.In(mentions) } });
                        comment.commentMention = [...comment.commentMention, ...users];
                    }
                }
                const save = yield CommentRepository.save(comment);
                const getAfterSave = yield CommentRepository.findOne({ id: save.id }, {
                    relations: ['profile', 'commentMention', 'thread']
                });
                const responseObject = {};
                responseObject.comment_mention = [];
                responseObject.comment_mention = yield Promise.all(getAfterSave.commentMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                    const mentioned = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: mentioned.user.first_name,
                            last_name: mentioned.user.last_name,
                            slug: mentioned.slug,
                        }
                    };
                }))).then(rez => rez);
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
                };
                return response.status(200).send(Object.assign(Object.assign({}, getAfterSave), responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    removeComment(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const CommentRepository = typeorm_1.getRepository(comments_1.Comment);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const comment = yield CommentRepository.findOne({ id: parseInt(request.params.comId, 10) }, {
                    relations: ['activity']
                });
                comment.activity.comments_count = comment.activity.comments_count - 1;
                yield CommentRepository.save(comment);
                yield CommentRepository.remove(comment);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
}
exports.CommentController = CommentController;
//# sourceMappingURL=CommentController.js.map