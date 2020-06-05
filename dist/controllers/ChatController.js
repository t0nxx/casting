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
const moment = require("moment");
const randomString = require("randomstring");
const auth_user_1 = require("../models/auth_user");
const users_profile_1 = require("../models/users_profile");
const friendship_friend_1 = require("../models/friendship_friend");
const chat_1 = require("../models/chat");
const pagination_1 = require("../helpers/pagination");
const chat_room_1 = require("../models/chat_room");
const profile_settings_1 = require("../models/profile_settings");
class ChatController {
    sendMessage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            const friendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            try {
                const sender = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const receiver = yield profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
                if (!receiver) {
                    throw new Error('receiver user not found');
                }
                const receiverSettings = yield profileSettingsRepository.findOne({ profile: receiver });
                let room;
                const isFriends = yield friendsRepository.findOne({
                    where: [
                        { fromUser: sender, toUser: receiver },
                        { fromUser: receiver, toUser: sender }
                    ],
                });
                if (isFriends) {
                    room = yield ChatRoomRepository.findOne({ name: isFriends.room });
                }
                else {
                    const isExistingRoom = yield ChatRoomRepository.findOne({
                        where: [
                            { participant1: sender, participant2: receiver },
                            { participant1: receiver, participant2: sender }
                        ]
                    });
                    if (isExistingRoom) {
                        room = isExistingRoom;
                    }
                    else {
                        const newRoom = new chat_room_1.ChatRoom();
                        newRoom.name = sender.slug + '-' + receiver.slug + '-' + randomString.generate({ length: 5 });
                        newRoom.participant1 = sender;
                        newRoom.participant2 = receiver;
                        newRoom.last_deleted_from_participant1 = new Date();
                        newRoom.last_deleted_from_participant2 = new Date();
                        const createNewRoom = yield ChatRoomRepository.save(newRoom);
                        room = createNewRoom;
                    }
                }
                const newMessage = new chat_1.Chat();
                newMessage.room = room;
                newMessage.sender = sender;
                newMessage.recipient = receiver;
                newMessage.message = request.body.message || '';
                const create = yield ChatRepository.save(newMessage);
                let isThierAutoResponseMsg = false;
                const autoresMsg = new chat_1.Chat();
                if (receiverSettings.response_all_time === true) {
                    isThierAutoResponseMsg = true;
                }
                else if (receiverSettings.response_from != null && receiverSettings.response_to != null) {
                    const isResponseTimeBtwnSettings = moment(new Date()).isBetween(receiverSettings.response_from, receiverSettings.response_to);
                    if (isResponseTimeBtwnSettings) {
                        isThierAutoResponseMsg = true;
                    }
                }
                let muted_from = [];
                if (create.room.muted_from) {
                    create.room.muted_from.forEach(slug => {
                        muted_from.push(slug);
                    });
                }
                const resObject = {
                    id: create.id,
                    created: create.created,
                    readRecipient: create.readRecipient,
                    room: create.room.name,
                    message: create.message,
                    partners: [sender.slug, receiver.slug],
                    settings: {
                        muted_from,
                    },
                    sender: {
                        first_name: sender.user.first_name,
                        last_name: sender.user.last_name,
                        slug: sender.slug,
                        avatar: sender.avatar,
                        id: sender.id,
                    },
                };
                const io = request.app.get('io');
                io.to(create.room.name).emit(isFriends ? 'message' : 'updateChatList', Object.assign({}, resObject));
                if (isThierAutoResponseMsg) {
                    autoresMsg.room = room;
                    autoresMsg.sender = receiver;
                    autoresMsg.recipient = sender;
                    autoresMsg.message = receiverSettings.response_message || '';
                    const autoResponseMsg = yield ChatRepository.save(autoresMsg);
                    let muted_from = [];
                    if (autoResponseMsg.room.muted_from) {
                        autoResponseMsg.room.muted_from.forEach(slug => {
                            muted_from.push(slug);
                        });
                    }
                    const resObjectAutoMsg = {
                        id: autoResponseMsg.id,
                        created: autoResponseMsg.created,
                        readRecipient: autoResponseMsg.readRecipient,
                        room: autoResponseMsg.room.name,
                        message: autoResponseMsg.message,
                        partners: [sender.slug, receiver.slug],
                        settings: {
                            muted_from,
                        },
                        sender: {
                            first_name: receiver.user.first_name,
                            last_name: receiver.user.last_name,
                            slug: receiver.slug,
                            avatar: receiver.avatar,
                            id: receiver.id,
                        },
                    };
                    io.to(create.room.name).emit(isFriends ? 'message' : 'updateChatList', Object.assign({}, resObjectAutoMsg));
                }
                return response.status(200).send(Object.assign({}, resObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getAllMessage(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const room = yield ChatRoomRepository.findOne({ name: request.params.room }, { relations: ['participant1', 'participant2'] });
                if (!room) {
                    throw new Error(`room ${request.params.room} not found`);
                }
                let after_date_condation;
                if (room.participant1.slug === user.slug) {
                    after_date_condation = room.last_deleted_from_participant1;
                }
                else {
                    after_date_condation = room.last_deleted_from_participant2;
                }
                after_date_condation = new Date(after_date_condation).toISOString();
                const q = ChatRepository.createQueryBuilder('chat')
                    .leftJoin('chat.sender', 'sender')
                    .leftJoin('chat.recipient', 'recipient')
                    .addSelect(['sender.id', 'sender.slug', 'sender.avatar', 'recipient.id', 'recipient.slug'])
                    .where(`chat.roomId = '${room.id}' and chat.created > '${after_date_condation}'`)
                    .orderBy('chat.id', 'DESC');
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                responseObject.results = responseObject.results.map(e => {
                    const partners = [e.sender.slug, e.recipient.slug];
                    delete e.recipient;
                    return Object.assign(Object.assign({}, e), { partners });
                });
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    getChats(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const subQ = ChatRepository.createQueryBuilder('chat')
                    .select('max(id) as id')
                    .where(`chat.senderId = '${user.id}' or chat.recipientId = '${user.id}'`)
                    .groupBy('chat.roomId');
                const q = ChatRepository.createQueryBuilder('chat')
                    .leftJoin('chat.sender', 'sender')
                    .leftJoin('chat.recipient', 'recipient')
                    .innerJoin('chat.room', 'room')
                    .innerJoinAndMapOne('chat.autherSender', auth_user_1.User, 'autherSender', 'autherSender.id = sender.userId')
                    .innerJoinAndMapOne('chat.autherRecipient', auth_user_1.User, 'autherRecipient', 'autherRecipient.id = recipient.userId')
                    .innerJoinAndMapOne('chat.senderSettings', profile_settings_1.ProfileSettings, 'senderSettings', 'sender.id = senderSettings.profileId')
                    .innerJoinAndMapOne('chat.recipientSettings', profile_settings_1.ProfileSettings, 'recipientSettings', 'recipient.id = recipientSettings.profileId')
                    .addSelect(['room.id', 'room.name', 'room.muted_from', 'sender.id', 'sender.slug', 'sender.avatar', 'recipient.id', 'recipient.slug', 'recipient.avatar'])
                    .where(`chat.id In (${subQ.getQuery()})`)
                    .orderBy('chat.id', 'DESC');
                const responseObject = yield pagination_1.ApplyPagination(request, response, q, false);
                if (responseObject.results) {
                    responseObject.results = responseObject.results.map(e => {
                        const formatedREsponse = {
                            first_name: '',
                            last_name: '',
                            avatar: '',
                            slug: '',
                            status: 'online',
                        };
                        if (e.sender.slug !== user.slug) {
                            formatedREsponse.slug = e.sender.slug;
                            formatedREsponse.avatar = e.sender.avatar;
                            formatedREsponse.status = e.senderSettings.my_status;
                        }
                        else {
                            formatedREsponse.slug = e.recipient.slug;
                            formatedREsponse.avatar = e.recipient.avatar;
                            formatedREsponse.status = e.recipientSettings.my_status;
                        }
                        if (e.autherSender.username !== user.slug) {
                            formatedREsponse.first_name = e.autherSender.first_name;
                            formatedREsponse.last_name = e.autherSender.last_name;
                        }
                        else {
                            formatedREsponse.first_name = e.autherRecipient.first_name;
                            formatedREsponse.last_name = e.autherRecipient.last_name;
                        }
                        return {
                            created: e.created,
                            room: e.room.name,
                            settings: {
                                muted_from: e.room.muted_from ? e.room.muted_from : [],
                            },
                            message: e.message,
                            readRecipient: e.readRecipient,
                            auth_user: formatedREsponse,
                            partners: [e.autherSender.username, e.autherRecipient.username]
                        };
                    });
                }
                return response.status(200).send(Object.assign({}, responseObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    muteChatRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const room = yield ChatRoomRepository.findOne({ name: request.params.room });
                if (!room) {
                    throw new Error(`room ${request.params.room} not found`);
                }
                if (!room.muted_from) {
                    room.muted_from = [];
                }
                const isAlreadyMuted = room.muted_from.find(slug => slug === user.slug);
                if (!isAlreadyMuted) {
                    room.muted_from.push(user.slug);
                }
                const save = yield ChatRoomRepository.save(room);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    unMuteChatRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const room = yield ChatRoomRepository.findOne({ name: request.params.room });
                if (!room) {
                    throw new Error(`room ${request.params.room} not found`);
                }
                if (!room.muted_from) {
                    room.muted_from = [];
                }
                const isAlreadyMuted = room.muted_from.find(slug => slug === user.slug);
                if (isAlreadyMuted) {
                    room.muted_from = room.muted_from.filter(slug => slug !== user.slug);
                }
                const save = yield ChatRoomRepository.save(room);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    clearChatFromRoom(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const user = yield profileRepository.findOne({ slug: request['user'].username });
                const room = yield ChatRoomRepository.findOne({ name: request.params.room }, { relations: ['participant1', 'participant2'] });
                if (!room) {
                    throw new Error(`room ${request.params.room} not found`);
                }
                if (room.participant1.slug === user.slug) {
                    room.last_deleted_from_participant1 = new Date();
                }
                else {
                    room.last_deleted_from_participant2 = new Date();
                }
                const save = yield ChatRoomRepository.save(room);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
    checkIfRoomExistOrCreateNewRoom(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const profileSettingsRepository = typeorm_1.getRepository(profile_settings_1.ProfileSettings);
            const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
            try {
                const sender = yield profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
                const receiver = yield profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
                if (!sender) {
                    throw new Error('account not found or deleted');
                }
                if (!receiver) {
                    throw new Error('receiver user not found');
                }
                const receiverSettings = yield profileSettingsRepository.findOne({ profile: receiver });
                let room;
                const isExistingRoom = yield ChatRoomRepository.findOne({
                    where: [
                        { participant1: sender, participant2: receiver },
                        { participant1: receiver, participant2: sender }
                    ]
                });
                if (isExistingRoom) {
                    room = isExistingRoom;
                }
                else if (sender.slug !== receiver.slug) {
                    const newRoom = new chat_room_1.ChatRoom();
                    newRoom.name = sender.slug + '-' + receiver.slug + '-' + randomString.generate({ length: 5 });
                    newRoom.participant1 = sender;
                    newRoom.participant2 = receiver;
                    newRoom.last_deleted_from_participant1 = new Date();
                    newRoom.last_deleted_from_participant2 = new Date();
                    const createNewRoom = yield ChatRoomRepository.save(newRoom);
                    room = createNewRoom;
                }
                const resObject = {
                    room: room.name,
                    auth_user: {
                        first_name: receiver.user.first_name,
                        last_name: receiver.user.last_name,
                        slug: receiver.slug,
                        avatar: receiver.avatar,
                        pk: receiver.id,
                        status: receiverSettings.my_status,
                    },
                };
                return response.status(200).send(Object.assign({}, resObject));
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ error: err });
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=ChatController.js.map