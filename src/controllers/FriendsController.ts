import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import { User } from '../models/newModels/auth_user';
import { Profile } from '../models/newModels/users_profile';
import { FriendshipFriend } from '../models/newModels/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/newModels/friendship_friendshiprequest';

export class FriendsController {
    /**
     * @Post
     * accept friend request
     */



    /**
     * @Post 
     */
    async sendFriendRequest(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
        try {
            const fromUser = await profileRepository.findOne({ slug: request['user'].username });
            const toUser = await profileRepository.findOne({ slug: request.params.slug });
            if (!toUser) { throw new Error('user not found'); }

            const newFriendRequest = new FriendshipFriendshipRequest();
            newFriendRequest.fromUser = fromUser;
            newFriendRequest.toUser = toUser;

            await friendRequestRepository.save(newFriendRequest);
            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
     * @Get 
     */
    async getAllFriendsRequest(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest).createQueryBuilder('f');
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const [data, count] = await friendRequestRepository
                .innerJoin('f.fromUser', 'senderUser')
                .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar'])
                .where(`f.toUser = ${profile.id}`)
                .getManyAndCount();

            return response.status(200).send({ data, count });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
    * @Get 
    */
    async getAllFriends(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendsRepository = getRepository(FriendshipFriend).createQueryBuilder('f');
        const friendsRepository2 = getRepository(FriendshipFriend).createQueryBuilder('f2');
        try {
            const profile = await profileRepository.findOne({ slug: request.params.slug });

            const [friendsRequestsTouser, count1] = await friendsRepository2
                .innerJoin('f2.fromUser', 'senderUser')
                .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar'])
                .where(`f2.toUser = ${profile.id}`)
                .getManyAndCount();
            friendsRequestsTouser.forEach(e => {
                e['auth_user'] = e.fromUser;
                delete e.fromUser;
            });

            const [friendsRequestsFromUser, count2] = await friendsRepository
                .innerJoin('f.toUser', 'reciverUser')
                .addSelect(['reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar'])
                .where(`f.fromUser = ${profile.id}`)
                .getManyAndCount();

            friendsRequestsFromUser.forEach(e => {
                e['auth_user'] = e.toUser;
                delete e.toUser;
            })

            const data = [...friendsRequestsTouser, ...friendsRequestsFromUser];
            const count = count1 + count2;
            return response.status(200).send({ data, count: parseInt(count.toString(), 10) });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }
}