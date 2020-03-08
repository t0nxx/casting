import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { Profile } from '../models/users_profile'
import { ProfileSettings } from '../models/profile_settings';
import { HeightRangeLookup } from '../models/height_range_lookup';
import { WeightRangeLookup } from '../models/weight_range_lookup';
import { BuildLookup } from '../models/build_lookup';
import { HairLookup } from '../models/hair_lookup';
import { EyeLookup } from '../models/eye_lookup';
import { EthnicitiesLookup } from '../models/ethnicities_lookup';
import { Hobbies } from '../models/profile_hobbies';
import { Courses } from '../models/profile_courses';
import { FriendshipFriend } from '../models/friendship_friend';
import { ProfileSocialNetworks } from '../models/profile_social';
import { UploadToS3 } from '../helpers/awsUploader';
import { User } from '../models/auth_user';
import { ProfileAlbum } from '../models/profile_album';
import { FriendshipFriendshipRequest } from '../models/friendship_friendshiprequest';
import { WhoSeeMe } from '../models/who_see_me';

export class ProfileController {

    /**
    * @Get All
    */

    async all(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            const data = await profileRepository.find();
            response.status(200).send({ error: false, data: { data } });
        } catch (error) {
            response.status(400).send({ error: true, data: error.message });
        }

    }

    /**
    * @Get One
    */

    async getProfile(request: Request, response: Response, next: NextFunction) {
        const friendsRepository = getRepository(FriendshipFriend);
        const profileRepository = getRepository(Profile);
        const whoSeeMeRepository = getRepository(WhoSeeMe);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
        try {
            const data = await profileRepository.findOne({ slug: request.params.slug }, {
                relations: ['user']
            });
            if (!data) { throw new Error('profile Not Found'); }
            const Myprofile = await profileRepository.findOne({ slug: request['user'].username });
            let is_friends = false;
            let is_IreceivedReqFromHim = false;
            let is_IsendReqToHim = false;
            const isFriendWithMe = await friendsRepository.findOne({
                where: [
                    { fromUser: data, toUser: Myprofile },
                    { fromUser: Myprofile, toUser: data }
                ],
            });
            const me = await profileRepository.findOne({ slug: request['user'].username });
            const him = await profileRepository.findOne({ slug: request.params.slug });
            const is_IreceivefromHim = await friendRequestRepository.findOne({
                where: {
                    toUser: me,
                    fromUser: him,
                }
            });
            const is_IsendtoHim = await friendRequestRepository.findOne({
                where: {
                    toUser: him,
                    fromUser: me,
                }
            });
            if (isFriendWithMe) { is_friends = true; }
            if (is_IreceivefromHim) { is_IreceivedReqFromHim = true; }
            if (is_IsendtoHim) { is_IsendReqToHim = true; }
            /// extract auth_user object for response
            const { first_name, last_name, email, username, id } = data.user;
            // important to not retrive all user data
            delete data.user;
            // tslint:disable-next-line: max-line-length
            const responseObject = { ...data, is_friends, is_IreceivedReqFromHim, is_IsendReqToHim, auth_user: { pk: id, first_name, last_name, email, username } }

            if (data.id !== Myprofile.id) {
                const isViewdAlready = await whoSeeMeRepository.findOne({ viewed: data.id, viewer: Myprofile.id });
                if (!isViewdAlready) {
                    const newViewer = new WhoSeeMe();
                    newViewer.viewed = data.id;
                    newViewer.viewer = Myprofile.id;
                    await whoSeeMeRepository.save(newViewer);
                }
            }
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }
    /**
     * @Get
     */

    async getProfileSettings(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request.params.slug });
            const settings = await profileSettingsRepository.findOne({ profile })
            if (!profile) { throw new Error('profile Not Found'); }
            return response.status(200).send({ success: true, ...settings });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Get
    */

    async getProfileAlbums(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const albumRepository = getRepository(ProfileAlbum);
        try {
            const profile = await profileRepository.findOne({ slug: request.params.slug }, {
                relations: ['albums']
            });
            if (!profile) { throw new Error('profile Not Found'); }
            if (request.query.some) {
                // return only 4
                profile.albums = profile.albums.slice(0, 4);
            }
            return response.status(200).send(profile.albums);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }
    /**
    * @Get
    */

    async getOneAlbum(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const albumRepository = getRepository(ProfileAlbum);
        try {
            const album = await albumRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                relations: ['activity_attachment']
            });
            if (!album) { throw new Error('album Not Found'); }
            return response.status(200).send(album);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Patch
    */

    async updateAlbum(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const albumRepository = getRepository(ProfileAlbum);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const album = await albumRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
            if (!album) { throw new Error('album Not Found'); }
            if (album.profile.id !== profile.id) {
                throw new Error('You are Not Allowed to edit this album');
            }
            album.album_name = request.body.album_name;
            await albumRepository.save(album);

            const afterUpdate = await albumRepository.findOne({ id: parseInt(request.params.id, 10) });
            return response.status(200).send(afterUpdate);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }
    /**
   * @Delete
   */

    async deleteAlbum(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const albumRepository = getRepository(ProfileAlbum);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const album = await albumRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
            if (!album) { throw new Error('album Not Found'); }
            if (album.profile.id !== profile.id) {
                throw new Error('You are Not Allowed to edit this album');
            }
            await albumRepository.remove(album);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Get
    */

    async addNewlbum(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const albumRepository = getRepository(ProfileAlbum);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            // const album = await albumRepository.findOne({ id: parseInt(request.params.id, 10) }, {
            //     relations: ['activity_attachment']
            // });
            const album = new ProfileAlbum();
            album.album_name = request.body.album_name;
            album.profile = profile;
            const newAlbum = await albumRepository.save(album);
            delete newAlbum.profile;
            return response.status(200).send(newAlbum);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Get
    */

    async getLookups(request: Request, response: Response, next: NextFunction) {

        const heightRepository = getRepository(HeightRangeLookup);
        const weightRepository = getRepository(WeightRangeLookup);
        const buildRepository = getRepository(BuildLookup);
        const hairRepository = getRepository(HairLookup);
        const eyeRepository = getRepository(EyeLookup);
        const ethnicitiesRepository = getRepository(EthnicitiesLookup);
        const hobbiesRepository = getRepository(Hobbies);
        //

        try {

            const [height_range, weight_range, build, hair, eye, ethnicities, hobbies] = await Promise.all([
                heightRepository.find(),
                weightRepository.find(),
                buildRepository.find(),
                hairRepository.find(),
                eyeRepository.find(),
                ethnicitiesRepository.find(),
                hobbiesRepository.find(),
            ]);
            return response.status(200).send({ height_range, weight_range, build, hair, eye, ethnicities, hobbies });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }




    /**
     * @Patch
     */

    async updateProfile(request: Request, response: Response, next: NextFunction) {
        const userRepository = getRepository(User);
        const profileRepository = getRepository(Profile);
        try {
            // username is the slug here 
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            // bcz front end send auth_user object on body -_-
            if (request.body.auth_user) {
                await profileRepository.update({ id: profile.id }, { location: request.body.location });
                await userRepository.update({ username: profile.slug }, {
                    first_name: request.body.auth_user.first_name,
                    last_name: request.body.auth_user.last_name,
                })
            } else {
                await profileRepository.update({ id: profile.id }, request.body);
            }

            const data = await profileRepository.findOne({ slug: request.params.slug }, {
                relations: ['user']
            });
            /// extract auth_user object for response
            const { first_name, last_name, email, username, isAdmin } = data.user;
            // important to not retrive all user data
            delete data.user;
            const responseObject = { ...data, isSuperAdmin: isAdmin, auth_user: { pk: data.id, first_name, last_name, email, username } }
            return response.status(200).send({ ...responseObject });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
     * @Patch
     */

    async updateCover(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            // username is the slug here 
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const newCover = await UploadToS3(request.files.file, 'image');
            await profileRepository.update({ id: profile.id }, { cover: newCover });
            const afterUpdate = await profileRepository.findOne({ id: profile.id });
            return response.status(200).send({ cover: afterUpdate.cover });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
     * @Post
     */

    async resetCover(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            // username is the slug here 
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const resetCover = 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/banner.jpg';
            await profileRepository.update({ id: profile.id }, { cover: resetCover });
            const afterUpdate = await profileRepository.findOne({ id: profile.id });
            return response.status(200).send({ cover: resetCover });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
     * @Patch
     */

    async updateAvatar(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        try {
            // username is the slug here 
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const newAvatar = await UploadToS3(request.files.file, 'image');
            await profileRepository.update({ id: profile.id }, { avatar: newAvatar });
            const afterUpdate = await profileRepository.findOne({ id: profile.id });
            return response.status(200).send({ avatar: afterUpdate.avatar });
        } catch (error) {
            /**
             * if ther error from class validator , return first object . else message of error
             */
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }


    /**
     * @Patch
     */

    async updateProfileSettings(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const profileSettingsRepository = getRepository(ProfileSettings);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const findSettings = await profileSettingsRepository.findOne({ profile })
            if (!profile) { throw new Error('profile Not Found'); }
            await profileSettingsRepository.update({ id: findSettings.id }, request.body);
            const newSettings = await profileSettingsRepository.findOne({ profile })
            return response.status(200).send({ success: true, ...newSettings });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }


    /**
     * @Post
     */

    async addHobbies(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const hobbyRepository = getRepository(Hobbies);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const hobby = await hobbyRepository.findOne({ id: request.body.hobbies })
            profile.users_profile_hobbies = [...profile.users_profile_hobbies, hobby];
            const save = await profileRepository.save(profile);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
     * @Post
     */

    async addTaninig(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const trainingRepository = getRepository(Courses);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const couese = new Courses();
            couese.course_name = request.body.course_name;
            couese.institute = request.body.institute;
            const newCourse = await trainingRepository.save(couese);
            profile.users_profile_courses = [...profile.users_profile_courses, newCourse];
            const save = await profileRepository.save(profile);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
     *@Post
     */

    async addSocialNetwork(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const socialRepository = getRepository(ProfileSocialNetworks);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const network = new ProfileSocialNetworks();
            network.network = request.body.network;
            network.url = request.body.url;
            const newNetwork = await socialRepository.save(network);
            profile.users_profile_social = [...profile.users_profile_social, newNetwork];
            await profileRepository.save(profile);
            // const savedAfterUpdateSocial = await profileRepository.findOne({ slug: request['user'].username });
            return response.status(200).send(newNetwork);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Put
    */

    async updateTaninig(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const trainingRepository = getRepository(Courses);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const course = await trainingRepository.findOne({ id: request.body.id });
            if (!course) { throw new Error('course Not Found'); }
            const saved = await trainingRepository.update({ id: request.body.id }, request.body);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Put
    */

    async updateSocialNetwork(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const socialRepository = getRepository(ProfileSocialNetworks);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const network = await socialRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!network) { throw new Error('network Not Found'); }
            const saved = await socialRepository.update({ id: parseInt(request.params.id, 10) }, request.body);
            const networkAfterUpdate = await socialRepository.findOne({ id: parseInt(request.params.id, 10) });
            // const profileAfterSocialUpdate = await profileRepository.findOne({ slug: request['user'].username });
            return response.status(200).send(networkAfterUpdate);
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Delete
    */

    async deleteTaninig(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const trainingRepository = getRepository(Courses);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const course = await trainingRepository.findOne({ id: parseInt(request.params.id, 10) })
            if (!course) { throw new Error('course Not Found'); }
            const remove = await trainingRepository.remove(course);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }

    /**
    * @Delete
    */

    async deleteHobbies(request: Request, response: Response, next: NextFunction) {

        const profileRepository = getRepository(Profile);
        const hobbyRepository = getRepository(Hobbies);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            if (!profile) { throw new Error('profile Not Found'); }
            const hobby = await hobbyRepository.findOne({ id: parseInt(request.params.id, 10) });
            if (!hobby) { throw new Error('hoby Not Found'); }
            profile.users_profile_hobbies = profile.users_profile_hobbies.filter(element => element.id != hobby.id);
            const save = await profileRepository.save(profile);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    }




    // async companies(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(users_profile);
    //     try {
    //         const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['companys'] });
    //         if (!data) { throw new Error('profile Not Found'); }
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    // async album(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(Profile);
    //     try {
    //         const data = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['profileAlbums'] });
    //         if (!data) { throw new Error('profile Not Found'); }
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    /**
    * @Add One
    */

    // async add(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(users_profile);
    //     try {
    //         const data = await profileRepository.save(request.body);
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

    /**
    * @Delete One
    */

    // async remove(request: Request, response: Response, next: NextFunction) {

    //     const profileRepository = getRepository(users_profile);
    //     try {
    //         const profileToRemove = await profileRepository.findOne(request.params.id);
    //         const data = await profileRepository.remove(profileToRemove);
    //         response.status(200).send({ error: false, data: { data } });
    //     } catch (error) {
    //         response.status(400).send({ error: true, data: error.message });
    //     }
    // }

}
