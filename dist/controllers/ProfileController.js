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
const profile_settings_1 = require("../models/profile_settings");
const height_range_lookup_1 = require("../models/height_range_lookup");
const weight_range_lookup_1 = require("../models/weight_range_lookup");
const build_lookup_1 = require("../models/build_lookup");
const hair_lookup_1 = require("../models/hair_lookup");
const eye_lookup_1 = require("../models/eye_lookup");
const ethnicities_lookup_1 = require("../models/ethnicities_lookup");
const profile_hobbies_1 = require("../models/profile_hobbies");
const profile_courses_1 = require("../models/profile_courses");
const friendship_friend_1 = require("../models/friendship_friend");
const profile_social_1 = require("../models/profile_social");
const awsUploader_1 = require("../helpers/awsUploader");
const auth_user_1 = require("../models/auth_user");
const profile_album_1 = require("../models/profile_album");
const friendship_friendshiprequest_1 = require("../models/friendship_friendshiprequest");
const who_see_me_1 = require("../models/who_see_me");
class ProfileController {
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const data = yield profileRepository.find();
                response.status(200).send({ error: false, data: { data } });
            }
            catch (error) {
                response.status(400).send({ error: true, data: error.message });
            }
        });
    }
    getProfile(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const whoSeeMeRepository = typeorm_1.getRepository(who_see_me_1.WhoSeeMe);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            try {
                const data = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user']
                });
                if (!data) {
                    throw new Error('profile Not Found');
                }
                const Myprofile = yield profileRepository.findOne({ slug: request['user'].username });
                let is_friends = false;
                let is_IreceivedReqFromHim = false;
                let is_IsendReqToHim = false;
                const isFriendWithMe = yield friendsRepository.findOne({
                    where: [
                        { fromUser: data, toUser: Myprofile },
                        { fromUser: Myprofile, toUser: data }
                    ],
                });
                const me = yield profileRepository.findOne({ slug: request['user'].username });
                const him = yield profileRepository.findOne({ slug: request.params.slug });
                const is_IreceivefromHim = yield friendRequestRepository.findOne({
                    where: {
                        toUser: me,
                        fromUser: him,
                    }
                });
                const is_IsendtoHim = yield friendRequestRepository.findOne({
                    where: {
                        toUser: him,
                        fromUser: me,
                    }
                });
                if (isFriendWithMe) {
                    is_friends = true;
                }
                if (is_IreceivefromHim) {
                    is_IreceivedReqFromHim = true;
                }
                if (is_IsendtoHim) {
                    is_IsendReqToHim = true;
                }
                const { first_name, last_name, email, username, id } = data.user;
                delete data.user;
                const responseObject = Object.assign(Object.assign({}, data), { is_friends, is_IreceivedReqFromHim, is_IsendReqToHim, auth_user: { pk: id, first_name, last_name, email, username } });
                if (data.id !== Myprofile.id) {
                    const isViewdAlready = yield whoSeeMeRepository.findOne({ viewed: data.id, viewer: Myprofile.id });
                    if (!isViewdAlready) {
                        const newViewer = new who_see_me_1.WhoSeeMe();
                        newViewer.viewed = data.id;
                        newViewer.viewer = Myprofile.id;
                        yield whoSeeMeRepository.save(newViewer);
                    }
                }
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getProfileSettings(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request.params.slug });
                const settings = yield profileSettingsRepository.findOne({ profile });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                return response.status(200).send(Object.assign({ success: true }, settings));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getProfileAlbums(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const albumRepository = typeorm_1.getRepository(profile_album_1.ProfileAlbum);
            try {
                const profile = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['albums']
                });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                if (request.query.some) {
                    profile.albums = profile.albums.slice(0, 4);
                }
                return response.status(200).send(profile.albums);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getOneAlbum(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const albumRepository = typeorm_1.getRepository(profile_album_1.ProfileAlbum);
            try {
                const album = yield albumRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                    relations: ['activity_attachment']
                });
                if (!album) {
                    throw new Error('album Not Found');
                }
                return response.status(200).send(album);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateAlbum(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const albumRepository = typeorm_1.getRepository(profile_album_1.ProfileAlbum);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const album = yield albumRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
                if (!album) {
                    throw new Error('album Not Found');
                }
                if (album.profile.id !== profile.id) {
                    throw new Error('You are Not Allowed to edit this album');
                }
                album.album_name = request.body.album_name;
                yield albumRepository.save(album);
                const afterUpdate = yield albumRepository.findOne({ id: parseInt(request.params.id, 10) });
                return response.status(200).send(afterUpdate);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    deleteAlbum(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const albumRepository = typeorm_1.getRepository(profile_album_1.ProfileAlbum);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const album = yield albumRepository.findOne({ id: parseInt(request.params.id, 10) }, { relations: ['profile'] });
                if (!album) {
                    throw new Error('album Not Found');
                }
                if (album.profile.id !== profile.id) {
                    throw new Error('You are Not Allowed to edit this album');
                }
                yield albumRepository.remove(album);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    addNewlbum(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const albumRepository = typeorm_1.getRepository(profile_album_1.ProfileAlbum);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const album = new profile_album_1.ProfileAlbum();
                album.album_name = request.body.album_name;
                album.profile = profile;
                const newAlbum = yield albumRepository.save(album);
                delete newAlbum.profile;
                return response.status(200).send(newAlbum);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getLookups(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const heightRepository = typeorm_1.getRepository(height_range_lookup_1.HeightRangeLookup);
            const weightRepository = typeorm_1.getRepository(weight_range_lookup_1.WeightRangeLookup);
            const buildRepository = typeorm_1.getRepository(build_lookup_1.BuildLookup);
            const hairRepository = typeorm_1.getRepository(hair_lookup_1.HairLookup);
            const eyeRepository = typeorm_1.getRepository(eye_lookup_1.EyeLookup);
            const ethnicitiesRepository = typeorm_1.getRepository(ethnicities_lookup_1.EthnicitiesLookup);
            const hobbiesRepository = typeorm_1.getRepository(profile_hobbies_1.Hobbies);
            try {
                const [height_range, weight_range, build, hair, eye, ethnicities, hobbies] = yield Promise.all([
                    heightRepository.find(),
                    weightRepository.find(),
                    buildRepository.find(),
                    hairRepository.find(),
                    eyeRepository.find(),
                    ethnicitiesRepository.find(),
                    hobbiesRepository.find(),
                ]);
                return response.status(200).send({ height_range, weight_range, build, hair, eye, ethnicities, hobbies });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateProfile(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                if (request.body.auth_user) {
                    yield profileRepository.update({ id: profile.id }, { location: request.body.location });
                    yield userRepository.update({ username: profile.slug }, {
                        first_name: request.body.auth_user.first_name,
                        last_name: request.body.auth_user.last_name,
                    });
                }
                else {
                    yield profileRepository.update({ id: profile.id }, request.body);
                }
                const data = yield profileRepository.findOne({ slug: request.params.slug }, {
                    relations: ['user']
                });
                const { first_name, last_name, email, username, isAdmin } = data.user;
                delete data.user;
                const responseObject = Object.assign(Object.assign({}, data), { isSuperAdmin: isAdmin, auth_user: { pk: data.id, first_name, last_name, email, username } });
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateCover(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const newCover = yield awsUploader_1.UploadToS3(request.files.file, 'image');
                yield profileRepository.update({ id: profile.id }, { cover: newCover });
                const afterUpdate = yield profileRepository.findOne({ id: profile.id });
                return response.status(200).send({ cover: afterUpdate.cover });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    resetCover(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const resetCover = 'https://casting-secret-new.s3.eu-central-1.amazonaws.com/banner.jpg';
                yield profileRepository.update({ id: profile.id }, { cover: resetCover });
                const afterUpdate = yield profileRepository.findOne({ id: profile.id });
                return response.status(200).send({ cover: resetCover });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateAvatar(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const newAvatar = yield awsUploader_1.UploadToS3(request.files.file, 'image');
                yield profileRepository.update({ id: profile.id }, { avatar: newAvatar });
                const afterUpdate = yield profileRepository.findOne({ id: profile.id });
                return response.status(200).send({ avatar: afterUpdate.avatar });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateProfileSettings(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const findSettings = yield profileSettingsRepository.findOne({ profile });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                yield profileSettingsRepository.update({ id: findSettings.id }, request.body);
                const newSettings = yield profileSettingsRepository.findOne({ profile });
                return response.status(200).send(Object.assign({ success: true }, newSettings));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    addHobbies(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const hobbyRepository = typeorm_1.getRepository(profile_hobbies_1.Hobbies);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const hobby = yield hobbyRepository.findOne({ id: request.body.hobbies });
                profile.users_profile_hobbies = [...profile.users_profile_hobbies, hobby];
                const save = yield profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    addTaninig(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const trainingRepository = typeorm_1.getRepository(profile_courses_1.Courses);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const couese = new profile_courses_1.Courses();
                couese.course_name = request.body.course_name;
                couese.institute = request.body.institute;
                const newCourse = yield trainingRepository.save(couese);
                profile.users_profile_courses = [...profile.users_profile_courses, newCourse];
                const save = yield profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    addSocialNetwork(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const socialRepository = typeorm_1.getRepository(profile_social_1.ProfileSocialNetworks);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const network = new profile_social_1.ProfileSocialNetworks();
                network.network = request.body.network;
                network.url = request.body.url;
                const newNetwork = yield socialRepository.save(network);
                profile.users_profile_social = [...profile.users_profile_social, newNetwork];
                yield profileRepository.save(profile);
                return response.status(200).send(newNetwork);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateTaninig(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const trainingRepository = typeorm_1.getRepository(profile_courses_1.Courses);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const course = yield trainingRepository.findOne({ id: request.body.id });
                if (!course) {
                    throw new Error('course Not Found');
                }
                const saved = yield trainingRepository.update({ id: request.body.id }, request.body);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    updateSocialNetwork(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const socialRepository = typeorm_1.getRepository(profile_social_1.ProfileSocialNetworks);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const network = yield socialRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!network) {
                    throw new Error('network Not Found');
                }
                const saved = yield socialRepository.update({ id: parseInt(request.params.id, 10) }, request.body);
                const networkAfterUpdate = yield socialRepository.findOne({ id: parseInt(request.params.id, 10) });
                return response.status(200).send(networkAfterUpdate);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    deleteTaninig(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const trainingRepository = typeorm_1.getRepository(profile_courses_1.Courses);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const course = yield trainingRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!course) {
                    throw new Error('course Not Found');
                }
                const remove = yield trainingRepository.remove(course);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    deleteHobbies(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const hobbyRepository = typeorm_1.getRepository(profile_hobbies_1.Hobbies);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                if (!profile) {
                    throw new Error('profile Not Found');
                }
                const hobby = yield hobbyRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!hobby) {
                    throw new Error('hoby Not Found');
                }
                profile.users_profile_hobbies = profile.users_profile_hobbies.filter(element => element.id != hobby.id);
                const save = yield profileRepository.save(profile);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
}
exports.ProfileController = ProfileController;
//# sourceMappingURL=ProfileController.js.map