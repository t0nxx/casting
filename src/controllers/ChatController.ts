import { getRepository, In } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/newModels/auth_user';
import { Profile } from '../models/newModels/users_profile';
import { FriendshipFriend } from '../models/newModels/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/newModels/friendship_friendshiprequest';
import { Chat } from '../models/newModels/chat';
import { ApplyPagination } from '../helpers/pagination';

export class ChatController {

    /**
      * @Post Send Message
      */
    async sendMessage(request, response: Response, next) {
        const profileRepository = getRepository(Profile);
        const ChatRepository = getRepository(Chat);
        const friendsRepository = getRepository(FriendshipFriend);
        try {
            // const sender = await profileRepository.findOne({ slug: request['user'].username });
            // const isRoomExist = await firendsRepository.findOne({ room: request.params.room });
            // if (!isRoomExist) { throw new Error('Room Not Found'); }

            // const newMessage = new Chat();
            // newMessage.sender = sender;
            // newMessage.room = request.params.room;
            // newMessage.message = request.body.message || '';
            // const create = await ChatRepository.save(newMessage);
            // /**
            //  * Socket work here
            //  */
            // const io = request.app.get('io');
            // io.to(request.params.room).emit('message', { room: request.params.room });
            const sender = await profileRepository.findOne({ slug: request['user'].username });
            const receiver = await profileRepository.findOne({ slug: request.params.slug });

            if (!receiver) {
                throw new Error('receiver user not found');
            }

            let room = sender.slug + '-' + receiver.slug + '-' + randomString.generate({ length: 5 });

            const isFriends = await friendsRepository.findOne({
                where: [
                    { fromUser: sender, toUser: receiver },
                    { fromUser: receiver, toUser: sender }
                ],
            });
            if (isFriends) {
                room = isFriends.room;
            } else {
                // find if thier is existing chat btwn sender and recevier to not create another room .
                const isExistingChat = await ChatRepository.findOne({
                    where: [
                        // tslint:disable-next-line: object-literal-shorthand
                        { sender: sender, recipient: receiver },
                        { sender: receiver, recipient: sender }
                    ]
                });
                if (isExistingChat) {
                    room = isExistingChat.room;
                }
            }

            const newMessage = new Chat();
            newMessage.sender = sender;
            newMessage.recipient = receiver;
            newMessage.room = room;
            newMessage.message = request.body.message || '';
            const create = await ChatRepository.save(newMessage);
            /**
             * Socket work here
             */
            const io = request.app.get('io');
            // tslint:disable-next-line: object-literal-shorthand
            io.to(room).emit('message', { room: room, sender: sender.slug });

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
      * @Post Send Message
      */
    async getAllMessage(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const ChatRepository = getRepository(Chat);
        try {
            const user = await profileRepository.findOne({ slug: request['user'].username });
            const q = ChatRepository.createQueryBuilder('chat')
                .leftJoin('chat.sender', 'sender')
                .leftJoin('chat.recipient', 'recipient')
                .addSelect(['sender.id', 'sender.slug', 'sender.avatar', 'recipient.id', 'recipient.slug'])
                .where(`chat.room like '${request.params.room}'`)
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
            return response.status(400).send({ success: false, error: err });
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
        try {
            // for sql issue in grouping 
            // set global sql_mode='';

            const user = await profileRepository.findOne({ slug: request['user'].username });
            const subQ = ChatRepository.createQueryBuilder('chat')
                .select('max(id) as id')
                .where(`chat.senderId = '${user.id}' or chat.recipientId = '${user.id}'`)
                .groupBy('chat.room');

            const q = ChatRepository.createQueryBuilder('chat')
                .leftJoin('chat.sender', 'sender')
                .leftJoin('chat.recipient', 'recipient')
                .innerJoinAndMapOne('chat.autherSender', User, 'autherSender', 'autherSender.id = sender.userId')
                .innerJoinAndMapOne('chat.autherRecipient', User, 'autherRecipient', 'autherRecipient.id = recipient.userId')
                .addSelect(['sender.id', 'sender.slug', 'sender.avatar', 'recipient.id', 'recipient.slug', 'recipient.avatar'])
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
                    };
                    if (e.sender.slug !== user.slug) {
                        formatedREsponse.slug = e.sender.slug;
                        formatedREsponse.avatar = e.sender.avatar;
                    } else {
                        formatedREsponse.slug = e.recipient.slug;
                        formatedREsponse.avatar = e.recipient.avatar;
                    }

                    if (e.autherSender.username !== user.slug) {
                        formatedREsponse.first_name = e.autherSender.first_name;
                        formatedREsponse.last_name = e.autherSender.last_name;
                    } else {
                        formatedREsponse.first_name = e.autherRecipient.first_name;
                        formatedREsponse.last_name = e.autherRecipient.last_name;
                    }

                    return {
                        id: e.id,
                        created: e.created,
                        room: e.room, message: e.message,
                        readRecipient: e.readRecipient,
                        auth_user: formatedREsponse,
                        partners: [e.autherSender.username, e.autherRecipient.username]
                    }
                });

            }

            return response.status(200).send({ ...responseObject });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    }

}