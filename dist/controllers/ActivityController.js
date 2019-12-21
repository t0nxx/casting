"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const auth_user_1 = require("../models/newModels/auth_user");
const users_profile_1 = require("../models/newModels/users_profile");
const pagination_1 = require("../helpers/pagination");
const activity_1 = require("../models/newModels/activity");
const profile_settings_1 = require("../models/newModels/profile_settings");
const FriendsController_1 = require("./FriendsController");
const activity_attachment_1 = require("../models/newModels/activity_attachment");
const awsUploader_1 = require("../helpers/awsUploader");
const company_1 = require("../models/newModels/company");
const activity_reports_1 = require("../models/newModels/activity_reports");
const SendNotification_1 = require("../jobs/SendNotification");
const Queue_1 = require("../jobs/Queue");
class ActivityController {
    getActivityOfUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const me = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user', 'likes', 'dislikes', 'bookmarks'], });
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user'],
                });
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId = (${profile.id})`)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                if (profile.id === me.id) {
                    q.leftJoinAndSelect('activity.company', 'company');
                }
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = me.likes.map(ac => ac.id);
                const myDisLikes = me.dislikes.map(ac => ac.id);
                const myBookMarks = me.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    let is_admin = false;
                    if (profile.id === me.id) {
                        is_admin = true;
                    }
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked, is_admin });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getActivityOfCompany(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const me = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user', 'likes', 'dislikes', 'bookmarks'] });
                const company = yield companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
                const profile = yield profileRepository.findOne({ id: company.profile.id }, {
                    relations: ['user'],
                });
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .innerJoinAndSelect('activity.company', 'company')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.companyId = (${company.id})`)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = me.likes.map(ac => ac.id);
                const myDisLikes = me.dislikes.map(ac => ac.id);
                const myBookMarks = me.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    let is_admin = false;
                    if (profile.id === me.id) {
                        is_admin = true;
                    }
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked, is_admin });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getOneActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const ActivityAttachmentRepository = typeorm_1.getRepository(activity_attachment_1.ActivityAttachment);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                    relations: ['activityMention', 'activity_attachment', 'profile', 'company']
                });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                const profile = yield profileRepository.findOne({ id: activity.profile.id }, { relations: ['user'] });
                const author_settings = yield profileSettingsRepository.findOne({ profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                let activity_mention = [];
                activity_mention = yield Promise.all(activity.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                    let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    };
                }))).then(rez => rez);
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                };
                delete activity.activityMention;
                delete activity.profile;
                return response.status(200).send(Object.assign({}, activity, { auth_user, author_settings,
                    activity_mention, liked: false, disliked: false, bookmarked: false }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllBookmarkedActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const myBookMarkedArray = profile.bookmarks.map(ac => ac.id);
                if (myBookMarkedArray.length < 1) {
                    return response.status(200).send({ results: [], count: 0 });
                }
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.company', 'company')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.id IN (${myBookMarkedArray})`)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                if (request.query.search) {
                    const query = request.query.search;
                    q.andWhere(`activity.content like '%${query}%'`);
                }
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    AddNewActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const author_settings = yield profileSettingsRepository.findOne({ profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                const activity = new activity_1.Activity();
                activity.content = request.body.content || '';
                activity.profile = profile;
                const mentions = [];
                if (request.body.mentions) {
                    request.body.mentions.forEach(element => {
                        mentions.push(element.auth_user);
                    });
                    if (mentions.length > 0) {
                        const users = yield profileRepository.find({ where: { id: typeorm_1.In(mentions) } });
                        activity.activityMention = [...users];
                    }
                }
                const save = yield ActivityRepository.save(activity);
                const getAfterSave = yield ActivityRepository.findOne({ id: save.id }, {
                    relations: ['activityMention', 'activity_attachment']
                });
                let activity_mention = [];
                activity_mention = yield Promise.all(getAfterSave.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                    let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    };
                }))).then(rez => rez);
                delete getAfterSave.activityMention;
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                };
                return response.status(200).send(Object.assign({}, getAfterSave, { auth_user, author_settings,
                    activity_mention, liked: false, disliked: false, bookmarked: false }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    AddNewActivityToCompany(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const companyRepository = typeorm_1.getRepository(company_1.Company);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const company = yield companyRepository.findOne({ profile });
                if (!company) {
                    throw new Error('please create company first');
                }
                const author_settings = yield profileSettingsRepository.findOne({ profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                const activity = new activity_1.Activity();
                activity.content = request.body.content || '';
                activity.profile = profile;
                activity.company = company;
                const mentions = [];
                if (request.body.mentions) {
                    request.body.mentions.forEach(element => {
                        mentions.push(element.auth_user);
                    });
                    if (mentions.length > 0) {
                        const users = yield profileRepository.find({ where: { id: typeorm_1.In(mentions) } });
                        activity.activityMention = [...users];
                    }
                }
                const save = yield ActivityRepository.save(activity);
                const getAfterSave = yield ActivityRepository.findOne({ id: save.id }, {
                    relations: ['activityMention', 'activity_attachment', 'company']
                });
                let activity_mention = [];
                activity_mention = yield Promise.all(getAfterSave.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                    let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    };
                }))).then(rez => rez);
                delete getAfterSave.activityMention;
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                };
                return response.status(200).send(Object.assign({}, getAfterSave, { auth_user, author_settings,
                    activity_mention, liked: false, disliked: false, bookmarked: false }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    LikeActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                const liked = myLikes.includes(activity.id);
                const disliked = myDisLikes.includes(activity.id);
                if (liked) {
                    profile.likes = profile.likes.filter(ac => ac.id !== activity.id);
                    activity.like_count = activity.like_count - 1;
                    yield ActivityRepository.save(activity);
                    yield profileRepository.save(profile);
                    return response.status(200).send({ success: true });
                }
                if (disliked) {
                    profile.dislikes = profile.dislikes.filter(ac => ac.id !== activity.id);
                    activity.dislike_count = activity.dislike_count - 1;
                    profile.likes = [...profile.likes, activity];
                    activity.like_count = activity.like_count + 1;
                    yield ActivityRepository.save(activity);
                    yield profileRepository.save(profile);
                    return response.status(200).send({ success: true });
                }
                profile.likes = [...profile.likes, activity];
                activity.like_count = activity.like_count + 1;
                let saveLikedActivity = yield ActivityRepository.save(activity);
                yield profileRepository.save(profile);
                const notiToQueu = {
                    actor_first_name: profile.user.first_name,
                    actor_last_name: profile.user.last_name,
                    actor_avatar: profile.avatar,
                    type: SendNotification_1.NotificationTypeEnum.like,
                    target_id: activity.id,
                    recipient: profile.id,
                };
                yield Queue_1.default.add(notiToQueu);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    DisLikeActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                const liked = myLikes.includes(activity.id);
                const disliked = myDisLikes.includes(activity.id);
                if (disliked) {
                    profile.dislikes = profile.dislikes.filter(ac => ac.id !== activity.id);
                    activity.dislike_count = activity.dislike_count - 1;
                    yield ActivityRepository.save(activity);
                    yield profileRepository.save(profile);
                    return response.status(200).send({ success: true });
                }
                if (liked) {
                    profile.likes = profile.likes.filter(ac => ac.id !== activity.id);
                    activity.like_count = activity.like_count - 1;
                    profile.dislikes = [...profile.dislikes, activity];
                    activity.dislike_count = activity.dislike_count + 1;
                    yield ActivityRepository.save(activity);
                    yield profileRepository.save(profile);
                    return response.status(200).send({ success: true });
                }
                profile.dislikes = [...profile.dislikes, activity];
                activity.dislike_count = activity.dislike_count + 1;
                let saveLikedActivity = yield ActivityRepository.save(activity);
                yield profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    BookmarkActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['bookmarks'],
                });
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                const bookmarked = myBookMarks.includes(activity.id);
                if (bookmarked) {
                    profile.bookmarks = profile.bookmarks.filter(p => p.id !== activity.id);
                    yield profileRepository.save(profile);
                    return response.status(200).send({ success: true });
                }
                profile.bookmarks = [...profile.bookmarks, activity];
                yield profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    reportActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const ActivityReportsRepository = typeorm_1.getRepository(activity_reports_1.ActivityReports);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                if (!request.body.reason) {
                    throw new Error('you must enter reason');
                }
                const activivtyReport = new activity_reports_1.ActivityReports();
                activivtyReport.activity = activity;
                activivtyReport.profile = profile;
                activivtyReport.reason = request.body.reason;
                activity.resports_count = activity.resports_count + 1;
                yield ActivityReportsRepository.save(activivtyReport);
                yield ActivityRepository.save(activity);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    HideActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['hidden'],
                });
                const myHiddenActivity = profile.hidden.map(ac => ac.id);
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                const hidden = myHiddenActivity.includes(activity.id);
                if (hidden) {
                    profile.hidden = profile.hidden.filter(p => p.id !== activity.id);
                    yield profileRepository.save(profile);
                    return response.status(200).send({ success: true });
                }
                profile.hidden = [...profile.hidden, activity];
                yield profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    UpdateMediaToActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const ActivityAttachmentRepository = typeorm_1.getRepository(activity_attachment_1.ActivityAttachment);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const author_settings = yield profileSettingsRepository.findOne({ profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!activity) {
                    throw new Error('activivty not found');
                }
                const file = request.files.file;
                const mime = file.mimetype;
                const splited = mime.split('/')[0];
                const uploadAndGetUrl = yield awsUploader_1.UploadToS3(request.files.file, splited);
                const type = splited === 'image' ? 'IMG' : splited === 'audio' ? 'AUDIO' : splited === 'video' ? 'VIDEO' : 'IMG';
                console.log(type);
                console.log(splited);
                const media = new activity_attachment_1.ActivityAttachment();
                media.profile = profile;
                media.activity = activity;
                media.type = type;
                media.path = uploadAndGetUrl;
                const saved = yield ActivityAttachmentRepository.save(media);
                const getAfterSave = yield ActivityRepository.findOne({ id: activity.id }, {
                    relations: ['activityMention', 'activity_attachment']
                });
                let activity_mention = [];
                activity_mention = yield Promise.all(getAfterSave.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                    let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    };
                }))).then(rez => rez);
                delete getAfterSave.activityMention;
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                };
                return response.status(200).send(Object.assign({}, getAfterSave, { auth_user, author_settings,
                    activity_mention, liked: false, disliked: false, bookmarked: false }));
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllActivityTest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            try {
                const profile = yield profileRepository.createQueryBuilder('p')
                    .innerJoin('p.user', 'user')
                    .leftJoin('p.likes', 'likes')
                    .leftJoin('p.dislikes', 'dislikes')
                    .leftJoin('p.bookmarks', 'bookmarks')
                    .leftJoin('p.hidden', 'hidden')
                    .select([
                    'p.id', 'p.avatar', 'p.slug',
                    'user.first_name', 'user.last_name', 'user.email', 'user.username',
                    'likes.id', 'dislikes.id', 'bookmarks.id', 'hidden.id'
                ])
                    .where(`p.slug like '${request['user'].username}'`)
                    .getOne();
                const friends = yield FriendsController_1.getAllFriendSharedBtwnApp(request, response, profile.slug);
                const friendsArray = friends.map(e => e.pk);
                const myHiddenActivity = profile.hidden.map(e => e.id);
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .innerJoinAndMapOne('activity.author_settings', profile_settings_1.ProfileSettings, 'settings', 'profile.id = settings.profileId')
                    .where(`activity.profileId IN (${friendsArray})`)
                    .andWhere('activity.companyId is null')
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                if (friendsArray.length < 1) {
                    return response.status(200).send({ results: [], count: 0 });
                }
                if (myHiddenActivity.length > 0) {
                    q.andWhere(`activity.id NOT IN (${myHiddenActivity})`);
                }
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        const mentioned = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: mentioned.user.first_name,
                                last_name: mentioned.user.last_name,
                                slug: mentioned.slug,
                            }
                        };
                    }))).then(rez => rez);
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, liked, disliked, bookmarked });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    AddNewVideoOrAudio(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const ActivityAttachmentRepository = typeorm_1.getRepository(activity_attachment_1.ActivityAttachment);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const activity = new activity_1.Activity();
                activity.content = '';
                activity.profile = profile;
                const saveActivity = yield ActivityRepository.save(activity);
                const file = request.files.file;
                const mime = file.mimetype;
                const splited = mime.split('/')[0];
                const uploadAndGetUrl = yield awsUploader_1.UploadToS3(request.files.file, splited);
                const type = splited === 'image' ? 'IMG' : splited === 'audio' ? 'AUDIO' : splited === 'video' ? 'VIDEO' : 'IMG';
                console.log(type);
                console.log(splited);
                const media = new activity_attachment_1.ActivityAttachment();
                media.profile = profile;
                media.activity = saveActivity;
                media.type = type;
                media.path = uploadAndGetUrl;
                const saveActivityAttachment = yield ActivityAttachmentRepository.save(media);
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                };
                const getActivityAfterInsert = yield ActivityRepository.findOne({ id: saveActivity.id }, {
                    relations: ['activity_attachment']
                });
                return response.status(200).send(Object.assign({}, getActivityAfterInsert, { auth_user }));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllVideoOfUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const me = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId = (${profile.id})`)
                    .andWhere(`activity_attachment.type like 'VIDEO' `)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    let is_admin = false;
                    if (profile.id === me.id) {
                        is_admin = true;
                    }
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked, is_admin });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllAudioOfUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const me = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId = (${profile.id})`)
                    .andWhere(`activity_attachment.type like 'AUDIO' `)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    let is_admin = false;
                    if (profile.id === me.id) {
                        is_admin = true;
                    }
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked, is_admin });
                }))).then(rez => rez);
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllImagesOfUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const me = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId = (${profile.id})`)
                    .andWhere(`activity_attachment.type like 'IMG' `)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                let responseObject = {};
                responseObject.results = yield q.getMany();
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    let is_admin = false;
                    if (profile.id === me.id) {
                        is_admin = true;
                    }
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked, is_admin });
                }))).then(rez => rez);
                if (request.query.some) {
                    responseObject.results = responseObject.results.slice(0, 10);
                }
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllImagesOfAlbum(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const me = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId = (${profile.id})`)
                    .andWhere(`activity_attachment.type like 'IMG' `)
                    .andWhere(`activity_attachment.album_id = ${parseInt(request.params.id, 10)}`)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                responseObject.results = yield Promise.all(responseObject.results.map((ac) => __awaiter(this, void 0, void 0, function* () {
                    const author_settings = yield profileSettingsRepository.findOne({ profile: ac.profile }, { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
                    const liked = myLikes.includes(ac.id);
                    const disliked = myDisLikes.includes(ac.id);
                    const bookmarked = myBookMarks.includes(ac.id);
                    const auth_user = {
                        pk: ac.profile.id,
                        first_name: ac['user'].first_name,
                        last_name: ac['user'].last_name,
                        email: ac['user'].email,
                        username: ac['user'].username,
                        slug: ac.profile.slug,
                        avatar: ac.profile.avatar,
                    };
                    ac.activity_mention = yield Promise.all(ac.activityMention.map((p) => __awaiter(this, void 0, void 0, function* () {
                        let profile = yield profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                        return {
                            auth_user: {
                                first_name: profile.user.first_name,
                                last_name: profile.user.last_name,
                                slug: profile.slug,
                            }
                        };
                    }))).then(rez => rez);
                    let is_admin = false;
                    if (profile.id === me.id) {
                        is_admin = true;
                    }
                    delete ac.profile;
                    delete ac['user'];
                    delete ac.activityMention;
                    return Object.assign({}, ac, { auth_user, author_settings, liked, disliked, bookmarked, is_admin });
                }))).then(rez => rez);
                return response.status(200).send(responseObject.results);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    addImageToAlbum(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const ActivityAttachmentRepository = typeorm_1.getRepository(activity_attachment_1.ActivityAttachment);
            try {
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
                yield ActivityAttachmentRepository.update({ activity }, { album_id: request.body.album_id });
                activity.content = request.body.content;
                yield ActivityRepository.save(activity);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteActivity(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const ActivityAttachmentRepository = typeorm_1.getRepository(activity_attachment_1.ActivityAttachment);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const activity = yield ActivityRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
                if (activity.profile.id === profile.id) {
                    yield ActivityRepository.remove(activity);
                    return response.status(200).send({ success: true });
                }
                throw new Error('you are no allowed to delete this post');
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.ActivityController = ActivityController;
//# sourceMappingURL=ActivityController.js.map