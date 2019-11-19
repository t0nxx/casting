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
class ActivityController {
    getAllActivity(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ActivityRepository = typeorm_1.getRepository(activity_1.Activity);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks', 'hidden'],
                });
                const friends = yield FriendsController_1.getAllFriendSharedBtwnApp(request, response, profile.slug);
                const friendsArray = friends.map(e => e.pk);
                const myHiddenActivity = profile.hidden.map(e => e.id);
                console.log(myHiddenActivity.length);
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId IN (${friendsArray})`)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                if (myHiddenActivity.length > 0) {
                    q.andWhere(`activity.id NOT IN (${myHiddenActivity})`);
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
    getActivityOfUser(request, response) {
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
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.id IN (${myBookMarkedArray})`)
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
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
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
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                };
                delete save.profile;
                return response.status(200).send(Object.assign({}, save, { auth_user }));
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
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
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
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
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
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username }, {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks', 'hidden'],
                });
                const friends = yield FriendsController_1.getAllFriendSharedBtwnApp(request, response, profile.slug);
                const friendsArray = friends.map(e => e.pk);
                const myHiddenActivity = profile.hidden.map(e => e.id);
                console.time('q');
                const q = ActivityRepository.createQueryBuilder('activity')
                    .innerJoin('activity.profile', 'profile')
                    .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                    .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                    .innerJoinAndMapOne('activity.user', auth_user_1.User, 'user', 'user.id = profile.userId')
                    .where(`activity.profileId IN (${friendsArray})`)
                    .orderBy('activity.publish_date', 'DESC')
                    .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);
                if (myHiddenActivity.length > 0) {
                    q.andWhere(`activity.id NOT IN (${myHiddenActivity})`);
                }
                console.timeEnd('q');
                console.time('pag');
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                console.timeEnd('pag');
                const myLikes = profile.likes.map(ac => ac.id);
                const myDisLikes = profile.dislikes.map(ac => ac.id);
                const myBookMarks = profile.bookmarks.map(ac => ac.id);
                console.time('loop');
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
                console.timeEnd('loop');
                return response.status(200).send(Object.assign({}, responseObject));
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