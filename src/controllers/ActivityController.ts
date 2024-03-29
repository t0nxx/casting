import { getRepository, In } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/auth_user';
import { Profile } from '../models/users_profile';
import { FriendshipFriend } from '../models/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/friendship_friendshiprequest';
import { Chat } from '../models/chat';
import { ApplyPagination } from '../helpers/pagination';
import { Activity } from '../models/activity';
import { ProfileSettings } from '../models/profile_settings';
import { getAllFriendSharedBtwnApp } from './FriendsController';
import { ActivityAttachment } from '../models/activity_attachment';
import { UploadToS3 } from '../helpers/awsUploader';
import { Company } from '../models/company';
import { ActivityReports } from '../models/activity_reports';
import { NotificationShape, NotificationTypeEnum } from '../jobs/SendNotification';
import { notificationQueue } from '../main';
import * as Sentry from '@sentry/node';

class ActivityController {

    async getActivityOfUser(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const me = await profileRepository.findOne({ slug: request['user'].username },
                { relations: ['user', 'likes', 'dislikes', 'bookmarks'], });
            const profile = await profileRepository.findOne({ slug: request.params.slug },
                {
                    relations: ['user'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.profileId = (${profile.id})`)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);

            if (profile.id === me.id) {
                q.leftJoinAndSelect('activity.company', 'company');
            }


            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = me.likes.map(ac => ac.id);
            const myDisLikes = me.dislikes.map(ac => ac.id);
            const myBookMarks = me.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings = await profileSettingsRepository.findOne({ profile: ac.profile });
                delete author_settings.profile;
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                let is_admin = false;
                if (profile.id === me.id) {
                    is_admin = true;
                }
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked, is_admin };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getActivityOfCompany(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const companyRepository = getRepository(Company);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const me = await profileRepository.findOne({ slug: request['user'].username },
                { relations: ['user', 'likes', 'dislikes', 'bookmarks'] });

            const company = await companyRepository.findOne({ slug: request.params.slug }, { relations: ['profile'] });
            const profile = await profileRepository.findOne({ id: company.profile.id },
                {
                    relations: ['user'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .innerJoinAndSelect('activity.company', 'company')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.companyId = (${company.id})`)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);

            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = me.likes.map(ac => ac.id);
            const myDisLikes = me.dislikes.map(ac => ac.id);
            const myBookMarks = me.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings: any = await profileSettingsRepository.findOne({ profile: ac.profile },
                    { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                let is_admin = false;
                if (profile.id === me.id) {
                    is_admin = true;
                }
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked, is_admin };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getOneActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityAttachmentRepository = getRepository(ActivityAttachment);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                relations: ['activityMention', 'activity_attachment', 'profile', 'company']
            });
            if (!activity) { throw new Error('post has been deleted'); }

            const profile = await profileRepository.findOne({ id: activity.profile.id }, { relations: ['user'] });
            const author_settings = await profileSettingsRepository.findOne({ profile },
                { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });

            let activity_mention = [];
            activity_mention = await Promise.all(activity.activityMention.map(async p => {
                let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                return {
                    auth_user: {
                        first_name: profile.user.first_name,
                        last_name: profile.user.last_name,
                        slug: profile.slug,
                    }
                }
            })
            ).then(rez => rez);
            const auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }

            delete activity.activityMention;
            delete activity.profile;

            return response.status(200).send({
                ...activity, auth_user, author_settings,
                activity_mention,
                liked: false, disliked: false, bookmarked: false,
            });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getAllBookmarkedActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);
            const myBookMarkedArray = profile.bookmarks.map(ac => ac.id);

            if (myBookMarkedArray.length < 1) {
                return response.status(200).send({ results: [], count: 0 });
            }

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.company', 'company')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.id IN (${myBookMarkedArray})`)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);

            if (request.query.search) {
                const query = request.query.search;
                q.andWhere(`activity.content like '%${query}%'`);
            }

            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings: any = await profileSettingsRepository.findOne({ profile: ac.profile },
                    { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async AddNewActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const author_settings = await profileSettingsRepository.findOne({ profile },
                { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
            const activity = new Activity();
            activity.content = request.body.content || '';
            activity.profile = profile;
            const mentions: any = [];
            if (request.body.mentions) {
                request.body.mentions.forEach(element => {
                    mentions.push(element.auth_user);
                });
                if (mentions.length > 0) {
                    const users = await profileRepository.find({ where: { id: In(mentions) } });
                    activity.activityMention = [...users];
                }
            }

            const save = await ActivityRepository.save(activity);
            const getAfterSave = await ActivityRepository.findOne({ id: save.id }, {
                relations: ['activityMention', 'activity_attachment']
            });

            let activity_mention = [];
            activity_mention = await Promise.all(getAfterSave.activityMention.map(async p => {
                let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                return {
                    auth_user: {
                        first_name: profile.user.first_name,
                        last_name: profile.user.last_name,
                        slug: profile.slug,
                    }
                }
            })
            ).then(rez => rez);
            delete getAfterSave.activityMention;
            const auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }

            mentions.map(async e => {
                /**
                *  send notification to user 
                * 
                * 
                * 
                */
                // console.log(e);
                const notiToQueu: NotificationShape = {
                    actor_first_name: profile.user.first_name,
                    actor_last_name: profile.user.last_name,
                    actor_avatar: profile.avatar,
                    type: NotificationTypeEnum.mentionOnPost,
                    target_id: save.id,
                    recipient: e,
                }
                await notificationQueue.add(notiToQueu);
            })

            return response.status(200).send({
                ...getAfterSave, auth_user, author_settings,
                activity_mention,
                liked: false, disliked: false, bookmarked: false,
            });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async AddNewActivityToCompany(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const companyRepository = getRepository(Company);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const company = await companyRepository.findOne({ profile });
            if (!company) { throw new Error('please create company first'); }

            const author_settings = await profileSettingsRepository.findOne({ profile },
                { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
            const activity = new Activity();
            activity.content = request.body.content || '';
            activity.profile = profile;
            activity.company = company;
            const mentions: any = [];
            if (request.body.mentions) {
                request.body.mentions.forEach(element => {
                    mentions.push(element.auth_user);
                });
                if (mentions.length > 0) {
                    const users = await profileRepository.find({ where: { id: In(mentions) } });
                    activity.activityMention = [...users];
                }
            }

            const save = await ActivityRepository.save(activity);
            const getAfterSave = await ActivityRepository.findOne({ id: save.id }, {
                relations: ['activityMention', 'activity_attachment', 'company']
            });

            let activity_mention = [];
            activity_mention = await Promise.all(getAfterSave.activityMention.map(async p => {
                let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                return {
                    auth_user: {
                        first_name: profile.user.first_name,
                        last_name: profile.user.last_name,
                        slug: profile.slug,
                    }
                }
            })
            ).then(rez => rez);
            delete getAfterSave.activityMention;
            const auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }

            mentions.map(async e => {
                /**
                *  send notification to user 
                * 
                * 
                * 
                */
                // console.log(e);
                const notiToQueu: NotificationShape = {
                    actor_first_name: company.name,
                    actor_avatar: company.avatar,
                    type: NotificationTypeEnum.mentionOnPost,
                    target_id: save.id,
                    recipient: e,
                }
                await notificationQueue.add(notiToQueu);
            })

            return response.status(200).send({
                ...getAfterSave, auth_user, author_settings,
                activity_mention,
                liked: false, disliked: false, bookmarked: false,
            });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async LikeActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
            if (!activity) { throw new Error('post has been deleted'); }

            const liked = myLikes.includes(activity.id);
            const disliked = myDisLikes.includes(activity.id);

            if (liked) {
                // remove like
                profile.likes = profile.likes.filter(ac => ac.id !== activity.id);
                activity.like_count = activity.like_count - 1;
                await ActivityRepository.save(activity);
                await profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            if (disliked) {
                // remove dislike and add like
                profile.dislikes = profile.dislikes.filter(ac => ac.id !== activity.id);
                activity.dislike_count = activity.dislike_count - 1;

                profile.likes = [...profile.likes, activity];
                activity.like_count = activity.like_count + 1;
                await ActivityRepository.save(activity);
                await profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            // not like or dislike
            profile.likes = [...profile.likes, activity];
            activity.like_count = activity.like_count + 1;
            let saveLikedActivity = await ActivityRepository.save(activity);
            await profileRepository.save(profile);

            /**
            *  send notification to user 
            * 
            * 
            * 
            */
            const notiToQueu: NotificationShape = {
                actor_first_name: profile.user.first_name,
                actor_last_name: profile.user.last_name,
                actor_avatar: profile.avatar,
                type: NotificationTypeEnum.like,
                target_id: activity.id,
                recipient: activity.profile.id,
            }
            await notificationQueue.add(notiToQueu);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async DisLikeActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
            if (!activity) { throw new Error('post has been deleted'); }

            const liked = myLikes.includes(activity.id);
            const disliked = myDisLikes.includes(activity.id);

            if (disliked) {
                // remove dislike and add like
                profile.dislikes = profile.dislikes.filter(ac => ac.id !== activity.id);
                activity.dislike_count = activity.dislike_count - 1;
                await ActivityRepository.save(activity);
                await profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            if (liked) {
                // remove like
                profile.likes = profile.likes.filter(ac => ac.id !== activity.id);
                activity.like_count = activity.like_count - 1;

                profile.dislikes = [...profile.dislikes, activity];
                activity.dislike_count = activity.dislike_count + 1;
                await ActivityRepository.save(activity);
                await profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }

            // not like or dislike
            profile.dislikes = [...profile.dislikes, activity];
            activity.dislike_count = activity.dislike_count + 1;
            let saveLikedActivity = await ActivityRepository.save(activity);
            await profileRepository.save(profile);

            /**
            *  send notification to user 
            * 
            * 
            * 
            */
            const notiToQueu: NotificationShape = {
                actor_first_name: profile.user.first_name,
                actor_last_name: profile.user.last_name,
                actor_avatar: profile.avatar,
                type: NotificationTypeEnum.dislike,
                target_id: activity.id,
                recipient: activity.profile.id,
            }
            await notificationQueue.add(notiToQueu);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async BookmarkActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['bookmarks'],
                });
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('post has been deleted'); }

            const bookmarked = myBookMarks.includes(activity.id);
            if (bookmarked) {
                // then , unbookmark
                profile.bookmarks = profile.bookmarks.filter(p => p.id !== activity.id);
                await profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }

            profile.bookmarks = [...profile.bookmarks, activity];
            await profileRepository.save(profile);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }
    async reportActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityReportsRepository = getRepository(ActivityReports);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('post has been deleted'); }

            if (!request.body.reason) { throw new Error('you must enter reason'); }

            const activivtyReport = new ActivityReports();
            activivtyReport.activity = activity;
            activivtyReport.profile = profile;
            activivtyReport.reason = request.body.reason;

            activity.resports_count = activity.resports_count + 1;

            await ActivityReportsRepository.save(activivtyReport);
            await ActivityRepository.save(activity);


            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }


    async HideActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['hidden'],
                });
            const myHiddenActivity = profile.hidden.map(ac => ac.id);

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('post has been deleted'); }

            const hidden = myHiddenActivity.includes(activity.id);
            if (hidden) {
                // then , unhidden
                profile.hidden = profile.hidden.filter(p => p.id !== activity.id);
                await profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }

            profile.hidden = [...profile.hidden, activity];
            await profileRepository.save(profile);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async UpdateMediaToActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityAttachmentRepository = getRepository(ActivityAttachment);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const author_settings = await profileSettingsRepository.findOne({ profile },
                { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('post has been deleted'); }

            const file: any = request.files.file;
            const mime = file.mimetype;
            const splited = mime.split('/')[0];

            const uploadAndGetUrl = await UploadToS3(request.files.file, splited);
            const type = splited === 'image' ? 'IMG' : splited === 'audio' ? 'AUDIO' : splited === 'video' ? 'VIDEO' : 'IMG'
            // console.log(type);
            // console.log(splited);
            const media = new ActivityAttachment();
            media.profile = profile;
            media.activity = activity;
            media.type = type;
            media.path = uploadAndGetUrl;
            const saved = await ActivityAttachmentRepository.save(media);

            /////////// it's too long , but the exist front won't update :'(

            const getAfterSave = await ActivityRepository.findOne({ id: activity.id }, {
                relations: ['activityMention', 'activity_attachment']
            });

            let activity_mention = [];
            activity_mention = await Promise.all(getAfterSave.activityMention.map(async p => {
                let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                return {
                    auth_user: {
                        first_name: profile.user.first_name,
                        last_name: profile.user.last_name,
                        slug: profile.slug,
                    }
                }
            })
            ).then(rez => rez);
            delete getAfterSave.activityMention;
            const auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }

            return response.status(200).send({
                ...getAfterSave, auth_user, author_settings,
                activity_mention,
                liked: false, disliked: false, bookmarked: false,
            });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getAllActivityTest(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.createQueryBuilder('p')
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

            const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            const friendsArray = friends.map(e => e.pk);
            // if the user is new and have no friends , then show the admin profile posts to him
            if (friendsArray.length < 1) {
                // id of the admin profile
                friendsArray.push(91);
            }
            const myHiddenActivity = profile.hidden.map(e => e.id);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .innerJoinAndMapOne('activity.author_settings', ProfileSettings, 'settings', 'profile.id = settings.profileId')
                .where(`activity.profileId IN (${friendsArray})`)
                .andWhere('activity.companyId is null')
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);

            // if (friendsArray.length < 1) {
            //     // no friends , no posts in wall
            //     return response.status(200).send({ results: [], count: 0 });
            // }
            if (myHiddenActivity.length > 0) {
                q.andWhere(`activity.id NOT IN (${myHiddenActivity})`);
            }


            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
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
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, liked, disliked, bookmarked };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async AddNewVideoOrAudio(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityAttachmentRepository = getRepository(ActivityAttachment);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const activity = new Activity();
            activity.content = '';
            activity.profile = profile;

            const saveActivity = await ActivityRepository.save(activity);

            const file: any = request.files.file;
            const mime = file.mimetype;
            const splited = mime.split('/')[0];

            const uploadAndGetUrl = await UploadToS3(request.files.file, splited);
            const type = splited === 'image' ? 'IMG' : splited === 'audio' ? 'AUDIO' : splited === 'video' ? 'VIDEO' : 'IMG'
            // console.log(type);
            // console.log(splited);
            const media = new ActivityAttachment();
            media.profile = profile;
            media.activity = saveActivity;
            media.type = type;
            media.path = uploadAndGetUrl;
            const saveActivityAttachment = await ActivityAttachmentRepository.save(media);
            const auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }
            const getActivityAfterInsert = await ActivityRepository.findOne({ id: saveActivity.id }, {
                relations: ['activity_attachment']
            })

            return response.status(200).send({ ...getActivityAfterInsert, auth_user });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getAllVideoOfUser(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const me = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const profile = await profileRepository.findOne({ slug: request.params.slug },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.profileId = (${profile.id})`)
                .andWhere(`activity_attachment.type like 'VIDEO' `)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);


            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings: any = await profileSettingsRepository.findOne({ profile: ac.profile },
                    { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                let is_admin = false;
                if (profile.id === me.id) {
                    is_admin = true;
                }
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked, is_admin };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getAllAudioOfUser(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const me = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const profile = await profileRepository.findOne({ slug: request.params.slug },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.profileId = (${profile.id})`)
                .andWhere(`activity_attachment.type like 'AUDIO' `)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);


            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings: any = await profileSettingsRepository.findOne({ profile: ac.profile },
                    { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                let is_admin = false;
                if (profile.id === me.id) {
                    is_admin = true;
                }
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked, is_admin };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getAllImagesOfUser(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const me = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const profile = await profileRepository.findOne({ slug: request.params.slug },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.profileId = (${profile.id})`)
                .andWhere(`activity_attachment.type like 'IMG' `)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);


            const responseObject = await ApplyPagination(request, response, q, false);
            //let responseObject: any = {};
            responseObject.results = await q.getMany();

            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings: any = await profileSettingsRepository.findOne({ profile: ac.profile },
                    { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                let is_admin = false;
                if (profile.id === me.id) {
                    is_admin = true;
                }
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked, is_admin };
            }),
            ).then(rez => rez);

            if (request.query.some) {
                responseObject.results = responseObject.results.slice(0, 6);
            }
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }

    async getAllImagesOfAlbum(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {

            const me = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const profile = await profileRepository.findOne({ slug: request.params.slug },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            // const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            // const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.profileId = (${profile.id})`)
                .andWhere(`activity_attachment.type like 'IMG' `)
                .andWhere(`activity_attachment.album_id = ${parseInt(request.params.id, 10)}`)
                .orderBy('activity.publish_date', 'DESC')
                .addSelect(['profile.id', 'profile.avatar', 'profile.slug']);


            const responseObject = await ApplyPagination(request, response, q, false);

            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            responseObject.results = await Promise.all(responseObject.results.map(async ac => {
                // temp setting for front end
                const author_settings: any = await profileSettingsRepository.findOne({ profile: ac.profile },
                    { select: ['can_see_wall', 'can_see_profile', 'can_see_friends', 'can_comment', 'can_send_message', 'can_contact_info'] });
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
                }

                ac.activity_mention = await Promise.all(ac.activityMention.map(async p => {
                    let profile = await profileRepository.findOne({ id: p.id }, { relations: ['user'] });
                    return {
                        auth_user: {
                            first_name: profile.user.first_name,
                            last_name: profile.user.last_name,
                            slug: profile.slug,
                        }
                    }
                })
                ).then(rez => rez);
                let is_admin = false;
                if (profile.id === me.id) {
                    is_admin = true;
                }
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked, is_admin };
            }),
            ).then(rez => rez);
            return response.status(200).send(responseObject.results);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });

        }
    }
    async addImageToAlbum(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityAttachmentRepository = getRepository(ActivityAttachment);
        try {
            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });

            await ActivityAttachmentRepository.update({ activity }, { album_id: request.body.album_id });
            activity.content = request.body.content;
            await ActivityRepository.save(activity);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });
        }
    }

    async reomveImageFromAlbum(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityAttachmentRepository = getRepository(ActivityAttachment);
        try {
            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });

            await ActivityAttachmentRepository.update({ activity }, { album_id: null });
            activity.content = request.body.content;
            await ActivityRepository.save(activity);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });
        }
    }

    async deleteActivity(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const ActivityAttachmentRepository = getRepository(ActivityAttachment);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });

            if (activity.profile.id === profile.id) {
                await ActivityRepository.remove(activity);
                return response.status(200).send({ success: true });
            }
            throw new Error('you are no allowed to delete this post');

        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(error);
            return response.status(400).send({ error: err });
        }
    }


}
export const activityController = new ActivityController();