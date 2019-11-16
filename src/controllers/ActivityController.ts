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

            const [results, count] = await ActivityRepository.findAndCount({
                relations: ['activity_attachment', 'profile', 'company'],
                order: { publish_date: 'DESC' }
            });
            const responseObject: any = {};
            const myLikes = profile.likes.map(ac => ac.id);
            const myDisLikes = profile.dislikes.map(ac => ac.id);
            const myBookMarks = profile.bookmarks.map(ac => ac.id);
            // temp setting for front end
            const author_settings = await profileSettingsRepository.findOne({ profile });
            responseObject.results = results.map(ac => {
                const liked = myLikes.includes(ac.id);
                const disliked = myDisLikes.includes(ac.id);
                const bookmarked = myBookMarks.includes(ac.id);
                const auth_user = {
                    pk: profile.id,
                    first_name: profile.user.first_name,
                    last_name: profile.user.last_name,
                    email: profile.user.email,
                    username: profile.user.username,
                    slug: profile.slug,
                    avatar: profile.avatar,
                }
                delete ac.profile;
                return {
                    ...ac, auth_user, author_settings, activity_mention: [{
                        auth_user: {
                            first_name: 'Mahmoud',
                            last_name: 'Ahmed',
                            slug: profile.slug,
                        }
                    }], liked, disliked, bookmarked,
                };
            })
            responseObject.count = count;
            // responseObject.next = 'hhhhh';
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
            const him = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });

            const me = await profileRepository.findOne({ slug: request['user'].username },
                {
                    relations: ['user', 'likes', 'dislikes', 'bookmarks'],
                });

            const [results, count] = await ActivityRepository.findAndCount({
                relations: ['activity_attachment', 'profile', 'company'],
                where: { profile: him },
                order: { publish_date: 'DESC' },
            });
            const responseObject: any = {};
            const myLikes = me.likes.map(ac => ac.id);
            const myDisLikes = me.dislikes.map(ac => ac.id);
            const myBookMarks = me.bookmarks.map(ac => ac.id);
            // temp setting for front end
            const author_settings = await profileSettingsRepository.findOne({ profile: him });
            let is_admin = false;
            if (me.id === him.id) {
                // well , this is my profile
                is_admin = true;
            }
            responseObject.results = results.map(ac => {
                const liked = myLikes.includes(ac.id);
                const disliked = myDisLikes.includes(ac.id);
                const bookmarked = myBookMarks.includes(ac.id);
                const auth_user = {
                    pk: him.id,
                    first_name: him.user.first_name,
                    last_name: him.user.last_name,
                    email: him.user.email,
                    username: him.user.username,
                    slug: him.slug,
                    avatar: him.avatar,
                }
                delete ac.profile;
                return {
                    ...ac, auth_user, author_settings, activity_mention: [{
                        // dummy just for testing
                        auth_user: {
                            first_name: 'Mahmoud',
                            last_name: 'Ahmed',
                            slug: him.slug,
                        }
                    }], liked, disliked, bookmarked, is_admin,
                };
            })
            responseObject.count = count;
            // responseObject.next = 'hhhhh';
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
}