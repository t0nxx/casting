import { getRepository, In } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/newModels/auth_user';
import { Profile } from '../models/newModels/users_profile';
import { FriendshipFriend } from '../models/newModels/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/newModels/friendship_friendshiprequest';
import { Chat } from '../models/newModels/chat';

export class ChatController {

    /**
      * @Post Send Message
      */
    async sendMessage(request, response: Response, next) {
        const profileRepository = getRepository(Profile);
        const ChatRepository = getRepository(Chat);
        const firendsRepository = getRepository(FriendshipFriend);
        try {
            const sender = await profileRepository.findOne({ slug: request['user'].username });
            const isRoomExist = await firendsRepository.findOne({ room: request.params.room });
            if (!isRoomExist) { throw new Error('Room Not Found'); }

            const newMessage = new Chat();
            newMessage.sender = sender;
            newMessage.room = request.params.room;
            newMessage.message = request.body.message || '';
            const create = await ChatRepository.save(newMessage);
            /**
             * Socket work here
             */
            const io = request.app.get('io');
            io.to(request.params.room).emit('message', { room: request.params.room });

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
                .addSelect(['sender.id', 'sender.slug', 'sender.avatar'])
                .where(`chat.room like '${request.params.room}'`)
                .orderBy('chat.id', 'DESC');

            let limit = 10;
            let page = 1;
            if (request.query.page) { page = parseInt(request.query.page, 10); }
            if (request.query.limit) { limit = parseInt(request.query.limit, 10); }
            q.take(limit);
            q.skip(limit * (page - 1));

            const [data, count] = await q.getManyAndCount();

            // make isRead is true 
            let [isNotSender, countIsNotSender] = await ChatRepository.createQueryBuilder('chat')
                .leftJoin('chat.sender', 'sender')
                .addSelect(['sender.id', 'sender.slug', 'sender.avatar'])
                .where(`chat.room like '${request.params.room}' and sender.id != ${user.id}`)
                .getManyAndCount();

            if (isNotSender) {
                // destruct categories id in one array
                const ids = isNotSender.map(m => m.id);
                await ChatRepository.update({ id: In(ids) }, { readRecipient: true });
            }

            return response.status(200).send({ success: true, data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

}