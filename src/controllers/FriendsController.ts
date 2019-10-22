import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/newModels/auth_user';
import { Profile } from '../models/newModels/users_profile';
import { FriendshipFriend } from '../models/newModels/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/newModels/friendship_friendshiprequest';

export class FriendsController {

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
     * @Post
     * accept friend request
     */

    async acceptFriendRequest(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
        const friendsRepository = getRepository(FriendshipFriend);
        try {
            const toUser = await profileRepository.findOne({ slug: request['user'].username });
            const fromUser = await profileRepository.findOne({ slug: request.params.slug });
            const friendRequest = await friendRequestRepository.findOne({
                where: {
                    toUser,
                    fromUser,
                }
            });

            if (!friendRequest) { throw new Error('No friend request with this user'); }
            await friendRequestRepository.remove(friendRequest);

            const addNewFriends = new FriendshipFriend();
            addNewFriends.fromUser = fromUser;
            addNewFriends.toUser = toUser;
            addNewFriends.room = fromUser.slug + '-' + toUser.slug + '-' + randomString.generate({ length: 5 });
            await friendsRepository.save(addNewFriends);

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
                .innerJoinAndMapOne('f.Auther', User, 'auther', 'auther.id = senderUser.userId')
                .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar'])
                .where(`f.toUser = ${profile.id}`)
                .getManyAndCount();

            const results = data.map(e => {
                const tempAuther: any = e['Auther'];
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
            })

            return response.status(200).send({ results, count });
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
            const profile = await profileRepository.findOne({ slug: request['user'].username });

            const [friendsRequestsTouser, count1] = await friendsRepository2
                .innerJoin('f2.fromUser', 'senderUser')
                .innerJoinAndMapOne('f2.Auther', User, 'auther', 'auther.id = senderUser.userId')
                .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar', 'f2.room'])
                .where(`f2.toUser = ${profile.id}`)
                .getManyAndCount();
            const res1 = friendsRequestsTouser.map(e => {
                // pk: number,
                // first_name: string,
                // last_name: string,
                // email: string,
                // username: string,
                // slug: string,
                // avatar: any
                const tempAuther: any = e['Auther'];
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

            const [friendsRequestsFromUser, count2] = await friendsRepository
                .innerJoin('f.toUser', 'reciverUser')
                .innerJoinAndMapOne('f.Auther', User, 'auther', 'auther.id = reciverUser.userId')
                .addSelect(['reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar', 'f.room'])
                .where(`f.fromUser = ${profile.id}`)
                .getManyAndCount();

            const res2 = friendsRequestsFromUser.map(e => {
                const tempAuther: any = e['Auther'];
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
            return response.status(200).send({ results, count: parseInt(count.toString(), 10) });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }
}