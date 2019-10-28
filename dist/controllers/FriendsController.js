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
const randomString = require("randomstring");
const auth_user_1 = require("../models/newModels/auth_user");
const users_profile_1 = require("../models/newModels/users_profile");
const friendship_friend_1 = require("../models/newModels/friendship_friend");
const friendship_friendshiprequest_1 = require("../models/newModels/friendship_friendshiprequest");
class FriendsController {
    sendFriendRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            try {
                const fromUser = yield profileRepository.findOne({ slug: request['user'].username });
                const toUser = yield profileRepository.findOne({ slug: request.params.slug });
                if (!toUser) {
                    throw new Error('user not found');
                }
                const friendRequest = yield friendRequestRepository.findOne({
                    where: [
                        { toUser, fromUser },
                        { toUser: fromUser, fromUser: toUser },
                    ],
                });
                if (friendRequest) {
                    throw new Error('Friend request already sent before');
                }
                const newFriendRequest = new friendship_friendshiprequest_1.FriendshipFriendshipRequest();
                newFriendRequest.fromUser = fromUser;
                newFriendRequest.toUser = toUser;
                yield friendRequestRepository.save(newFriendRequest);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    acceptFriendRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            try {
                const toUser = yield profileRepository.findOne({ slug: request['user'].username });
                const fromUser = yield profileRepository.findOne({ slug: request.params.slug });
                const friendRequest = yield friendRequestRepository.findOne({
                    where: {
                        toUser,
                        fromUser,
                    }
                });
                if (!friendRequest) {
                    throw new Error('No friend request with this user');
                }
                yield friendRequestRepository.remove(friendRequest);
                const addNewFriends = new friendship_friend_1.FriendshipFriend();
                addNewFriends.fromUser = fromUser;
                addNewFriends.toUser = toUser;
                addNewFriends.room = fromUser.slug + '-' + toUser.slug + '-' + randomString.generate({ length: 5 });
                yield friendsRepository.save(addNewFriends);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    rejectFriendRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            try {
                const toUser = yield profileRepository.findOne({ slug: request['user'].username });
                const fromUser = yield profileRepository.findOne({ slug: request.params.slug });
                const friendRequest = yield friendRequestRepository.findOne({
                    where: {
                        toUser,
                        fromUser,
                    }
                });
                if (!friendRequest) {
                    throw new Error('No friend request with this user');
                }
                yield friendRequestRepository.remove(friendRequest);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteFriend(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            try {
                const toUser = yield profileRepository.findOne({ slug: request['user'].username });
                const fromUser = yield profileRepository.findOne({ slug: request.params.slug });
                const friendShip = yield friendsRepository.findOne({
                    where: [
                        { toUser, fromUser },
                        { toUser: fromUser, fromUser: toUser }
                    ]
                });
                if (!friendShip) {
                    throw new Error('No friendShip with this user');
                }
                yield friendsRepository.remove(friendShip);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllFriendsRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest).createQueryBuilder('f');
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const [data, count] = yield friendRequestRepository
                    .innerJoin('f.fromUser', 'senderUser')
                    .innerJoinAndMapOne('f.Auther', auth_user_1.User, 'auther', 'auther.id = senderUser.userId')
                    .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar'])
                    .where(`f.toUser = ${profile.id}`)
                    .getManyAndCount();
                const results = data.map(e => {
                    const tempAuther = e['Auther'];
                    const formatedREsponse = {
                        pk: e.fromUser.id,
                        first_name: tempAuther.first_name,
                        last_name: tempAuther.last_name,
                        email: tempAuther.email,
                        username: tempAuther.username,
                        avatar: e.fromUser.avatar,
                        slug: e.fromUser.slug,
                    };
                    return formatedREsponse;
                });
                return response.status(200).send({ results, count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllFriends(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend).createQueryBuilder('f');
            const friendsRepository2 = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend).createQueryBuilder('f2');
            try {
                console.log('***********');
                console.time();
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const q1 = friendsRepository2
                    .innerJoin('f2.fromUser', 'senderUser')
                    .innerJoinAndMapOne('f2.Auther', auth_user_1.User, 'auther', 'auther.id = senderUser.userId')
                    .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar', 'f2.room'])
                    .where(`f2.toUser = ${profile.id}`);
                if (request.query.query) {
                    const query1 = request.query.query;
                    q1.andWhere(`auther.username like '%${query1}%' or auther.first_name like '%${query1}%' or auther.last_name like '%${query1}%' or senderUser.location like '%${query1}%'`);
                }
                const [friendsRequestsTouser, count1] = yield q1.getManyAndCount();
                const res1 = friendsRequestsTouser.map(e => {
                    const tempAuther = e['Auther'];
                    const formatedREsponse1 = {
                        pk: e.fromUser.id,
                        first_name: tempAuther.first_name,
                        last_name: tempAuther.last_name,
                        email: tempAuther.email,
                        username: tempAuther.username,
                        avatar: e.fromUser.avatar,
                        slug: e.fromUser.slug,
                        room: e.room,
                    };
                    return formatedREsponse1;
                });
                const q2 = friendsRepository
                    .innerJoin('f.toUser', 'reciverUser')
                    .innerJoinAndMapOne('f.Auther', auth_user_1.User, 'auther', 'auther.id = reciverUser.userId')
                    .addSelect(['reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar', 'f.room'])
                    .where(`f.fromUser = ${profile.id}`);
                if (request.query.query) {
                    const query2 = request.query.query;
                    q2.andWhere(`auther.username like '%${query2}%' or auther.first_name like '%${query2}%' or auther.last_name like '%${query2}%' or reciverUser.location like '%${query2}%'`);
                }
                const [friendsRequestsFromUser, count2] = yield q2.getManyAndCount();
                const res2 = friendsRequestsFromUser.map(e => {
                    const tempAuther = e['Auther'];
                    const formatedREsponse1 = {
                        pk: e.toUser.id,
                        first_name: tempAuther.first_name,
                        last_name: tempAuther.last_name,
                        email: tempAuther.email,
                        username: tempAuther.username,
                        avatar: e.toUser.avatar,
                        slug: e.toUser.slug,
                        room: e.room,
                    };
                    return formatedREsponse1;
                });
                const results = [...res1, ...res2];
                const count = count1 + count2;
                console.log('**********');
                console.timeEnd();
                return response.status(200).send({ results, count: parseInt(count.toString(), 10) });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.FriendsController = FriendsController;
//# sourceMappingURL=FriendsController.js.map