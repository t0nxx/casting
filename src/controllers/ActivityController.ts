import { getRepository, In } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/newModels/auth_user';
import { Profile } from '../models/newModels/users_profile';
import { FriendshipFriend } from '../models/newModels/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/newModels/friendship_friendshiprequest';
import { Chat } from '../models/newModels/chat';
import { ApplyPagination } from '../helpers/pagination';
import { Activity } from '../models/newModels/activity';
import { ProfileSettings } from '../models/newModels/profile_settings';
import { getAllFriendSharedBtwnApp } from './FriendsController';

export class ActivityController {
    // till now i'll make it get all for the same user
    async getAllActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            const friendsArray = friends.map(e => e.pk);

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.profileId IN (${friendsArray})`)
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
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }


    async getActivityOfUser(request: Request, response: Response) {
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
            return response.status(400).send({ success: false, error: err });

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

            const q = ActivityRepository.createQueryBuilder('activity')
                .innerJoin('activity.profile', 'profile')
                .leftJoinAndSelect('activity.activityMention', 'activity_mention')
                .leftJoinAndSelect('activity.activity_attachment', 'activity_attachment')
                .innerJoinAndMapOne('activity.user', User, 'user', 'user.id = profile.userId')
                .where(`activity.id IN (${myBookMarkedArray})`)
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
                delete ac.profile;
                delete ac['user'];
                delete ac.activityMention;
                return { ...ac, auth_user, author_settings, liked, disliked, bookmarked };
            }),
            ).then(rez => rez);
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    async AddNewActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
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
            const auth_user = {
                pk: profile.id,
                first_name: profile.user.first_name,
                last_name: profile.user.last_name,
                email: profile.user.email,
                username: profile.user.username,
                slug: profile.slug,
                avatar: profile.avatar,
            }

            delete save.profile;
            return response.status(200).send({ ...save, auth_user });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

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

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('activivty not found'); }

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
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

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

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('activivty not found'); }

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
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    async BookmarkActivity(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ActivityRepository = getRepository(Activity);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });
            const myBookMarks = profile.bookmarks.map(ac => ac.id);

            const activity = await ActivityRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!activity) { throw new Error('activivty not found'); }

            const bookmarked = myBookMarks.includes(activity.id);
            if (bookmarked) {
                return response.status(200).send({ success: true });
            }

            profile.bookmarks = [...profile.bookmarks, activity];
            await profileRepository.save(profile);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }
}