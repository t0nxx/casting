import { getRepository, In, MoreThan } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as moment from 'moment';
import * as randomString from 'randomstring';
import { User } from '../models/auth_user';
import { Profile } from '../models/users_profile';
import { FriendshipFriend } from '../models/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/friendship_friendshiprequest';
import { Chat } from '../models/chat';
import { ApplyPagination } from '../helpers/pagination';
import { ChatRoom } from '../models/chat_room';
import { ProfileSettings } from '../models/profile_settings';
import * as Sentry from '@sentry/node';

class ChatController {

    /**
      * @Post Send Message
      */
    async sendMessage(request, response: Response, next) {
        const profileRepository = getRepository(Profile);
        const profileSettingsRepository = getRepository(ProfileSettings)
        const ChatRepository = getRepository(Chat);
        const ChatRoomRepository = getRepository(ChatRoom);
        const friendsRepository = getRepository(FriendshipFriend);
        try {
            // io.to(request.params.room).emit('message', { room: request.params.room });
            const sender = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const receiver = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });

            if (!receiver) {
                throw new Error('receiver user not found');
            }
            const receiverSettings = await profileSettingsRepository.findOne({ profile: receiver });

            let room;

            const isFriends = await friendsRepository.findOne({
                where: [
                    { fromUser: sender, toUser: receiver },
                    { fromUser: receiver, toUser: sender }
                ],
            });
            if (isFriends) {
                room = await ChatRoomRepository.findOne({ name: isFriends.room });
            } else {
                // find if thier is existing chat btwn sender and recevier to not create another room .
                const isExistingRoom = await ChatRoomRepository.findOne({
                    where: [
                        // tslint:disable-next-line: object-literal-shorthand
                        { participant1: sender, participant2: receiver },
                        { participant1: receiver, participant2: sender }
                    ]
                });
                if (isExistingRoom) {
                    room = isExistingRoom;
                } else {
                    const newRoom = new ChatRoom();
                    newRoom.name = sender.slug + '-' + receiver.slug + '-' + randomString.generate({ length: 5 });
                    newRoom.participant1 = sender;
                    newRoom.participant2 = receiver;
                    newRoom.last_deleted_from_participant1 = new Date();
                    newRoom.last_deleted_from_participant2 = new Date();
                    const createNewRoom = await ChatRoomRepository.save(newRoom);
                    room = createNewRoom;
                }
            }

            const newMessage = new Chat();
            newMessage.room = room;
            newMessage.sender = sender;
            newMessage.recipient = receiver;
            newMessage.message = request.body.message || '';
            const create = await ChatRepository.save(newMessage);


            let isThierAutoResponseMsg = false;
            const autoresMsg = new Chat();

            if (receiverSettings.response_all_time === true) {
                isThierAutoResponseMsg = true;
            } else if (receiverSettings.response_from != null && receiverSettings.response_to != null) {
                const isResponseTimeBtwnSettings = moment(new Date()).isBetween(receiverSettings.response_from, receiverSettings.response_to);
                if (isResponseTimeBtwnSettings) {
                    isThierAutoResponseMsg = true;
                }
            }

            // loop over muted array and send them to the socket
            let muted_from = [];
            if (create.room.muted_from) {
                create.room.muted_from.forEach(slug => {
                    muted_from.push(slug);
                })
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
            }
            /**
             * Socket work here
             */
            const io = request.app.get('io');
            // tslint:disable-next-line: object-literal-shorthand
            io.to(create.room.name).emit(isFriends ? 'message' : 'updateChatList', {
                ...resObject,
            });

            // new .. check if thier is auto response message
            if (isThierAutoResponseMsg) {
                autoresMsg.room = room;
                autoresMsg.sender = receiver;
                autoresMsg.recipient = sender;
                autoresMsg.message = receiverSettings.response_message || '';
                const autoResponseMsg = await ChatRepository.save(autoresMsg);
                let muted_from = [];
                if (autoResponseMsg.room.muted_from) {
                    autoResponseMsg.room.muted_from.forEach(slug => {
                        muted_from.push(slug);
                    })
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
                }

                io.to(create.room.name).emit(isFriends ? 'message' : 'updateChatList', {
                    ...resObjectAutoMsg,
                });
            }

            return response.status(200).send({ ...resObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });

        }
    }

    /**
      * @Post Send Message
      */
    async getAllMessage(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ChatRepository = getRepository(Chat);
        const ChatRoomRepository = getRepository(ChatRoom);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const room = await ChatRoomRepository.findOne({ name: request.params.room }, { relations: ['participant1', 'participant2'] });
            if (!room) { throw new Error(`room ${request.params.room} not found`) }
            let after_date_condation;
            if (room.participant1.slug === user.slug) {
                after_date_condation = room.last_deleted_from_participant1;
            } else {
                after_date_condation = room.last_deleted_from_participant2;
            }
            after_date_condation = new Date(after_date_condation).toISOString();
            const q = ChatRepository.createQueryBuilder('chat')
                .leftJoin('chat.sender', 'sender')
                .leftJoin('chat.recipient', 'recipient')
                .addSelect(['sender.id', 'sender.slug', 'sender.avatar', 'recipient.id', 'recipient.slug'])
                .where(`chat.roomId = '${room.id}' and chat.created > '${after_date_condation}'`)
                .orderBy('chat.id', 'DESC');

            const responseObject = await ApplyPagination(request, response, q, false);

            responseObject.results = responseObject.results.map(e => {
                const partners = [e.sender.slug, e.recipient.slug];
                delete e.recipient;
                return { ...e, partners }
            })

            return response.status(200).send({ ...responseObject });

        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });
        }

        // // make isRead is true 
        // let [isNotSender, countIsNotSender] = await ChatRepository.createQueryBuilder('chat')
        //     .leftJoin('chat.sender', 'sender')
        //     .addSelect(['sender.id', 'sender.slug', 'sender.avatar'])
        //     .where(`chat.room like '${request.params.room}' and sender.id != ${user.id}`)
        //     .getManyAndCount();

        // if (isNotSender) {
        //     // destruct categories id in one array
        //     const ids = isNotSender.map(m => m.id);
        //     await ChatRepository.update({ id: In(ids) }, { readRecipient: true });
        // }

    }

    async getChats(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ChatRepository = getRepository(Chat);
        const profileSettingsRepository = getRepository(ProfileSettings)
        try {
            // for sql issue in grouping 
            // set global sql_mode='';

            // const settings = await profileSettingsRepository.findOne({ profile })

            const user = await profileRepository.findOne({ slug: request['user'].username });
            const subQ = ChatRepository.createQueryBuilder('chat')
                .select('max(id) as id')
                .where(`chat.senderId = '${user.id}' or chat.recipientId = '${user.id}'`)
                .groupBy('chat.roomId');

            const q = ChatRepository.createQueryBuilder('chat')
                .leftJoin('chat.sender', 'sender')
                .leftJoin('chat.recipient', 'recipient')
                .innerJoin('chat.room', 'room')
                .innerJoinAndMapOne('chat.autherSender', User, 'autherSender', 'autherSender.id = sender.userId')
                .innerJoinAndMapOne('chat.autherRecipient', User, 'autherRecipient', 'autherRecipient.id = recipient.userId')
                .innerJoinAndMapOne('chat.senderSettings', ProfileSettings, 'senderSettings', 'sender.id = senderSettings.profileId')
                .innerJoinAndMapOne('chat.recipientSettings', ProfileSettings, 'recipientSettings', 'recipient.id = recipientSettings.profileId')
                .addSelect(['room.id', 'room.name', 'room.muted_from', 'sender.id', 'sender.slug', 'sender.avatar', 'recipient.id', 'recipient.slug', 'recipient.avatar'])
                .where(`chat.id In (${subQ.getQuery()})`)
                .orderBy('chat.id', 'DESC');

            const responseObject = await ApplyPagination(request, response, q, false);

            // remove same user . to display only the other avatar
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
                    } else {
                        formatedREsponse.slug = e.recipient.slug;
                        formatedREsponse.avatar = e.recipient.avatar;
                        formatedREsponse.status = e.recipientSettings.my_status;
                    }

                    if (e.autherSender.username !== user.slug) {
                        formatedREsponse.first_name = e.autherSender.first_name;
                        formatedREsponse.last_name = e.autherSender.last_name;
                    } else {
                        formatedREsponse.first_name = e.autherRecipient.first_name;
                        formatedREsponse.last_name = e.autherRecipient.last_name;
                    }

                    return {
                        // id: e.id,
                        created: e.created,
                        room: e.room.name,
                        settings: {
                            muted_from: e.room.muted_from ? e.room.muted_from : [],
                        },
                        message: e.message,
                        readRecipient: e.readRecipient,
                        auth_user: formatedREsponse,
                        partners: [e.autherSender.username, e.autherRecipient.username]
                    }
                });

            }

            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });
        }
    }

    /**
     * @Post Send Message
     */
    async muteChatRoom(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ChatRoomRepository = getRepository(ChatRoom);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const room = await ChatRoomRepository.findOne({ name: request.params.room });
            if (!room) { throw new Error(`room ${request.params.room} not found`) }
            if (!room.muted_from) {
                room.muted_from = [];
            }
            const isAlreadyMuted = room.muted_from.find(slug => slug === user.slug);

            if (!isAlreadyMuted) {
                room.muted_from.push(user.slug);
            }
            const save = await ChatRoomRepository.save(room);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });
        }
    }

    /**
     * @Post Send Message
     */
    async unMuteChatRoom(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ChatRoomRepository = getRepository(ChatRoom);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const room = await ChatRoomRepository.findOne({ name: request.params.room });
            if (!room) { throw new Error(`room ${request.params.room} not found`) }
            if (!room.muted_from) {
                room.muted_from = [];
            }
            const isAlreadyMuted = room.muted_from.find(slug => slug === user.slug);

            if (isAlreadyMuted) {
                room.muted_from = room.muted_from.filter(slug => slug !== user.slug)
            }
            const save = await ChatRoomRepository.save(room);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });
        }
    }

    /**
   * @Post Send Message
   */
    async clearChatFromRoom(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ChatRoomRepository = getRepository(ChatRoom);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const room = await ChatRoomRepository.findOne({ name: request.params.room }, { relations: ['participant1', 'participant2'] });
            if (!room) { throw new Error(`room ${request.params.room} not found`) }

            if (room.participant1.slug === user.slug) {
                room.last_deleted_from_participant1 = new Date();
            } else {
                room.last_deleted_from_participant2 = new Date();
            }
            const save = await ChatRoomRepository.save(room);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });
        }
    }


    async checkIfRoomExistOrCreateNewRoom(request, response: Response, next) {
        const profileRepository = getRepository(Profile);
        const profileSettingsRepository = getRepository(ProfileSettings);
        const ChatRoomRepository = getRepository(ChatRoom);
        try {
            // io.to(request.params.room).emit('message', { room: request.params.room });
            const sender = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const receiver = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });

            if (!sender) {
                throw new Error('account not found or deleted');
            }

            if (!receiver) {
                throw new Error('receiver user not found');
            }
            const receiverSettings = await profileSettingsRepository.findOne({ profile: receiver });

            let room;
            // find if thier is existing chat btwn sender and recevier to not create another room .
            const isExistingRoom = await ChatRoomRepository.findOne({
                where: [
                    // tslint:disable-next-line: object-literal-shorthand
                    { participant1: sender, participant2: receiver },
                    { participant1: receiver, participant2: sender }
                ]
            });
            if (isExistingRoom) {
                room = isExistingRoom;
                // mean not create room for the same user
            } else if (sender.slug !== receiver.slug) {
                const newRoom = new ChatRoom();
                newRoom.name = sender.slug + '-' + receiver.slug + '-' + randomString.generate({ length: 5 });
                newRoom.participant1 = sender;
                newRoom.participant2 = receiver;
                newRoom.last_deleted_from_participant1 = new Date();
                newRoom.last_deleted_from_participant2 = new Date();
                const createNewRoom = await ChatRoomRepository.save(newRoom);
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
            }
            return response.status(200).send({ ...resObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            Sentry.captureException(err);
            return response.status(400).send({ error: err });

        }
    }


}
export const chatController = new ChatController();