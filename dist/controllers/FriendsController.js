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
const randomString = require("randomstring");
const auth_user_1 = require("../models/auth_user");
const users_profile_1 = require("../models/users_profile");
const friendship_friend_1 = require("../models/friendship_friend");
const friendship_friendshiprequest_1 = require("../models/friendship_friendshiprequest");
const _ = require("underscore");
const SendNotification_1 = require("../jobs/SendNotification");
const main_1 = require("../main");
const chat_1 = require("../models/chat");
const chat_room_1 = require("../models/chat_room");
const profile_settings_1 = require("../models/profile_settings");
class FriendsController {
    sendFriendRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            try {
                const fromUser = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const toUser = yield profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
                if (!toUser) {
                    throw new Error('user not found');
                }
                const friendShip = yield friendsRepository.findOne({
                    where: [
                        { toUser, fromUser },
                        { toUser: fromUser, fromUser: toUser }
                    ]
                });
                if (friendShip) {
                    throw new Error('You Already are friend with this user');
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
                const notiToQueu = {
                    actor_first_name: fromUser.user.first_name,
                    actor_last_name: fromUser.user.last_name,
                    actor_avatar: fromUser.avatar,
                    type: SendNotification_1.NotificationTypeEnum.sendFriendReq,
                    target_profile_slug: fromUser.slug,
                    recipient: toUser.id,
                };
                yield main_1.notificationQueue.add(notiToQueu);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    acceptFriendRequest(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const toUser = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const fromUser = yield profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
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
                const isExistingRoom = yield ChatRoomRepository.findOne({
                    where: [
                        { participant1: toUser, participant2: fromUser },
                        { participant1: fromUser, participant2: toUser }
                    ]
                });
                if (isExistingRoom) {
                    addNewFriends.room = isExistingRoom.name;
                }
                else {
                    const newRoom = new chat_room_1.ChatRoom();
                    newRoom.name = fromUser.slug + '-' + toUser.slug + '-' + randomString.generate({ length: 5 });
                    newRoom.participant1 = fromUser;
                    newRoom.participant2 = toUser;
                    newRoom.last_deleted_from_participant1 = new Date();
                    newRoom.last_deleted_from_participant2 = new Date();
                    const createNewRoom = yield ChatRoomRepository.save(newRoom);
                    addNewFriends.room = createNewRoom.name;
                }
                const saveNewFriend = yield friendsRepository.save(addNewFriends);
                const room = yield ChatRoomRepository.findOne({ name: saveNewFriend.room });
                const newMessage = new chat_1.Chat();
                newMessage.room = room;
                newMessage.sender = fromUser;
                newMessage.recipient = toUser;
                newMessage.message = 'Say hi to your new friend';
                const createMsg1 = yield ChatRepository.save(newMessage);
                const newMessage2 = new chat_1.Chat();
                newMessage.room = room;
                newMessage.sender = toUser;
                newMessage.recipient = fromUser;
                newMessage.message = 'Say hi to your new friend';
                const createMsg2 = yield ChatRepository.save(newMessage);
                const notiToQueu = {
                    actor_first_name: toUser.user.first_name,
                    actor_last_name: toUser.user.last_name,
                    actor_avatar: toUser.avatar,
                    type: SendNotification_1.NotificationTypeEnum.acceptFriendReq,
                    target_profile_slug: toUser.slug,
                    recipient: fromUser.id,
                };
                yield main_1.notificationQueue.add(notiToQueu);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
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
                return response.status(400).send({ error: err });
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
                return response.status(400).send({ error: err });
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
                return response.status(400).send({ error: err });
            }
        });
    }
    getAllFriends(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend).createQueryBuilder('f');
            const friendsRepository2 = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend).createQueryBuilder('f2');
            try {
                const profile = yield profileRepository.findOne({ slug: request.params.slug });
                const q1 = friendsRepository2
                    .innerJoin('f2.fromUser', 'senderUser')
                    .innerJoinAndMapOne('f2.Auther', auth_user_1.User, 'auther', 'auther.id = senderUser.userId')
                    .innerJoinAndMapOne('f2.senderSettings', profile_settings_1.ProfileSettings, 'senderSettings', 'senderUser.id = senderSettings.profileId')
                    .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar', 'f2.room'])
                    .where(`f2.toUserId = ${profile.id}`)
                    .orderBy('senderSettings.my_status', 'DESC');
                const q2 = friendsRepository
                    .innerJoin('f.toUser', 'reciverUser')
                    .innerJoinAndMapOne('f.Auther', auth_user_1.User, 'auther', 'auther.id = reciverUser.userId')
                    .innerJoinAndMapOne('f.recipientSettings', profile_settings_1.ProfileSettings, 'recipientSettings', 'reciverUser.id = recipientSettings.profileId')
                    .addSelect(['reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar', 'f.room'])
                    .where(`f.fromUserId = ${profile.id}`)
                    .orderBy('recipientSettings.my_status', 'DESC');
                if (request.query.query) {
                    const query1 = request.query.query;
                    q1.andWhere(`auther.username like '%${query1}%' or auther.first_name like '%${query1}%' or auther.last_name like '%${query1}%' or senderUser.location like '%${query1}%'`);
                    q2.andWhere(`auther.username like '%${query1}%' or auther.first_name like '%${query1}%' or auther.last_name like '%${query1}%' or reciverUser.location like '%${query1}%'`);
                }
                const [[friendsRequestsTouser, count1], [friendsRequestsFromUser, count2]] = yield Promise.all([q1.getManyAndCount(), q2.getManyAndCount()]);
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
                        status: e['senderSettings'].my_status,
                    };
                    return formatedREsponse1;
                });
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
                        status: e['recipientSettings'].my_status,
                    };
                    return formatedREsponse1;
                });
                let results = [...res1, ...res2];
                results = results.filter(e => e.slug !== profile.slug);
                results = results.filter(e => e.room.indexOf(profile.slug) != -1);
                results = results.filter((e, i) => results.findIndex(a => a['pk'] === e['pk']) === i);
                const count = count1 + count2;
                return response.status(200).send({ results, count: parseInt(count.toString(), 10) });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getSuggestedFriends(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            try {
                const profile = yield profileRepository.findOne({ slug: request['user'].username });
                const friends = yield getAllFriendSharedBtwnApp(request, response, profile.slug);
                const friendsArray = friends.map(e => e.pk);
                friendsArray.push(profile.id);
                const [notFriends, count] = yield profileRepository.createQueryBuilder('p')
                    .innerJoin('p.user', 'user')
                    .select(['p.id', 'p.slug', 'p.avatar', 'user.first_name', 'user.last_name', 'user.email'])
                    .where(`p.id NOT IN (${friendsArray})`)
                    .orderBy('p.id', 'DESC')
                    .getManyAndCount();
                let results = notFriends.map(e => {
                    const resObject = {
                        pk: e.id,
                        slug: e.slug,
                        avatar: e.avatar,
                        auth_user: Object.assign({}, e.user)
                    };
                    delete e.user;
                    return resObject;
                });
                results = _.sample(results, 10);
                return response.status(200).send({ results, count: 10 });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    makeAllusersFriendWithAdminForDevOnly(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const toUser = yield profileRepository.findOne({ slug: 'test9' }, { relations: ['user'] });
                const allUsers = yield profileRepository.find({ relations: ['user'] });
                allUsers.map((fromUser) => __awaiter(this, void 0, void 0, function* () {
                    const addNewFriends = new friendship_friend_1.FriendshipFriend();
                    addNewFriends.fromUser = fromUser;
                    addNewFriends.toUser = toUser;
                    const isExistingRoom = yield ChatRoomRepository.findOne({
                        where: [
                            { participant1: toUser, participant2: fromUser },
                            { participant1: fromUser, participant2: toUser }
                        ]
                    });
                    if (isExistingRoom) {
                        addNewFriends.room = isExistingRoom.name;
                    }
                    else {
                        const newRoom = new chat_room_1.ChatRoom();
                        newRoom.name = fromUser.slug + '-' + toUser.slug + '-' + randomString.generate({ length: 5 });
                        newRoom.participant1 = fromUser;
                        newRoom.participant2 = toUser;
                        newRoom.last_deleted_from_participant1 = new Date();
                        newRoom.last_deleted_from_participant2 = new Date();
                        const createNewRoom = yield ChatRoomRepository.save(newRoom);
                        addNewFriends.room = createNewRoom.name;
                    }
                    const saveNewFriend = yield friendsRepository.save(addNewFriends);
                    const room = yield ChatRoomRepository.findOne({ name: saveNewFriend.room });
                    const newMessage = new chat_1.Chat();
                    newMessage.room = room;
                    newMessage.sender = fromUser;
                    newMessage.recipient = toUser;
                    newMessage.message = 'Say hi to your new friend';
                    const createMsg1 = yield ChatRepository.save(newMessage);
                    const newMessage2 = new chat_1.Chat();
                    newMessage.room = room;
                    newMessage.sender = toUser;
                    newMessage.recipient = fromUser;
                    newMessage.message = 'Say hi to your new friend';
                    const createMsg2 = yield ChatRepository.save(newMessage);
                }));
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    removeAllusersFromFriendWithAdminForDevOnly(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const friendRequestRepository = typeorm_1.getRepository(friendship_friendshiprequest_1.FriendshipFriendshipRequest);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const adminProfile = yield profileRepository.findOne({ slug: 'test9' }, { relations: ['user'] });
                const friendsWithAdmin = yield friendsRepository.find({
                    where: [
                        { fromUser: adminProfile },
                        { toUser: adminProfile }
                    ]
                });
                yield friendsRepository.remove(friendsWithAdmin);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
}
exports.FriendsController = FriendsController;
function getAllFriendSharedBtwnApp(request, response, slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
        const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend).createQueryBuilder('f');
        try {
            const profile = yield profileRepository.findOne({ slug });
            const q1 = friendsRepository
                .innerJoin('f.fromUser', 'senderUser')
                .innerJoin('f.toUser', 'reciverUser')
                .innerJoinAndMapOne('f.senderUserObject', auth_user_1.User, 'autherSender', 'autherSender.id = senderUser.userId')
                .innerJoinAndMapOne('f.reciverUserObject', auth_user_1.User, 'autherReciver', 'autherReciver.id = reciverUser.userId')
                .addSelect(['senderUser.id', 'senderUser.slug', 'reciverUser.slug', 'reciverUser.id'])
                .where(`f.toUser = ${profile.id}`)
                .orWhere(`f.fromUser = ${profile.id}`);
            const [friends, count] = yield q1.getManyAndCount();
            const results = friends.map(e => {
                const notSameUser = profile.slug === e.fromUser.slug ? e.toUser : e.fromUser;
                const formatedREsponse = {
                    pk: 0,
                    first_name: '',
                    last_name: '',
                    email: '',
                    username: '',
                    avatar: '',
                    slug: '',
                    room: '',
                };
                const senderUserObject = e['senderUserObject'];
                const reciverUserObject = e['reciverUserObject'];
                if (senderUserObject.username === profile.slug) {
                    formatedREsponse.pk = notSameUser.id;
                }
                else {
                    formatedREsponse.pk = notSameUser.id;
                }
                return formatedREsponse;
            });
            return results;
        }
        catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ error: err });
        }
    });
}
exports.getAllFriendSharedBtwnApp = getAllFriendSharedBtwnApp;
//# sourceMappingURL=FriendsController.js.map