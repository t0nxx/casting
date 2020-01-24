import { getRepository, Not } from 'typeorm';
import { NextFunction, Request, Response } from 'express';
import * as randomString from 'randomstring';
import { User } from '../models/newModels/auth_user';
import { Profile } from '../models/newModels/users_profile';
import { FriendshipFriend } from '../models/newModels/friendship_friend';
import { FriendshipFriendshipRequest } from '../models/newModels/friendship_friendshiprequest';
import { ApplyPagination } from '../helpers/pagination';
import * as _ from 'underscore';
import { NotificationShape, NotificationTypeEnum } from '../jobs/SendNotification';
import { notificationQueue } from '../main';

export class FriendsController {

    /**
     * @Post 
     */
    async sendFriendRequest(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
        try {
            const fromUser = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const toUser = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
            if (!toUser) { throw new Error('user not found'); }

            const friendRequest = await friendRequestRepository.findOne({
                where: [
                    { toUser, fromUser },
                    { toUser: fromUser, fromUser: toUser },
                ],
            });

            if (friendRequest) { throw new Error('Friend request already sent before'); }

            const newFriendRequest = new FriendshipFriendshipRequest();
            newFriendRequest.fromUser = fromUser;
            newFriendRequest.toUser = toUser;

            await friendRequestRepository.save(newFriendRequest);

            const notiToQueu: NotificationShape = {
                actor_first_name: fromUser.user.first_name,
                actor_last_name: fromUser.user.last_name,
                actor_avatar: fromUser.avatar,
                type: NotificationTypeEnum.sendFriendReq,
                target_profile_slug: toUser.slug,
                recipient: toUser.id,
            }
            await notificationQueue.add(notiToQueu);
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
            const toUser = await profileRepository.findOne({ slug: request['user'].username }, { relations: ['user'] });
            const fromUser = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
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

            const notiToQueu: NotificationShape = {
                actor_first_name: toUser.user.first_name,
                actor_last_name: toUser.user.last_name,
                actor_avatar: toUser.avatar,
                type: NotificationTypeEnum.acceptFriendReq,
                target_profile_slug: fromUser.slug,
                recipient: fromUser.id,
            }
            await notificationQueue.add(notiToQueu);

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
    * @Post
    * reject friend request
    */

    async rejectFriendRequest(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
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

            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
     * @Delete
     * delete/unfriend
     */

    async deleteFriend(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendsRepository = getRepository(FriendshipFriend);
        try {
            const toUser = await profileRepository.findOne({ slug: request['user'].username });
            const fromUser = await profileRepository.findOne({ slug: request.params.slug });
            const friendShip = await friendsRepository.findOne({
                where: [
                    { toUser, fromUser },
                    { toUser: fromUser, fromUser: toUser }
                ]
            });

            if (!friendShip) { throw new Error('No friendShip with this user'); }
            await friendsRepository.remove(friendShip);
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
    async getAllFriends(request, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        const friendsRepository = getRepository(FriendshipFriend).createQueryBuilder('f');
        const friendsRepository2 = getRepository(FriendshipFriend).createQueryBuilder('f2');
        try {
            const profile = await profileRepository.findOne({ slug: request.params.slug });

            const q1 = friendsRepository2
                .innerJoin('f2.fromUser', 'senderUser')
                .innerJoinAndMapOne('f2.Auther', User, 'auther', 'auther.id = senderUser.userId')
                .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar', 'f2.room'])
                .where(`f2.toUser = ${profile.id}`);
            // search friends 
            if (request.query.query) {
                const query1 = request.query.query;
                q1.andWhere(`auther.username like '%${query1}%' or auther.first_name like '%${query1}%' or auther.last_name like '%${query1}%' or senderUser.location like '%${query1}%'`)
            }

            const [friendsRequestsTouser, count1] = await q1.getManyAndCount();

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

            const q2 = friendsRepository
                .innerJoin('f.toUser', 'reciverUser')
                .innerJoinAndMapOne('f.Auther', User, 'auther', 'auther.id = reciverUser.userId')
                .addSelect(['reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar', 'f.room'])
                .where(`f.fromUser = ${profile.id}`);

            // search friends 
            if (request.query.query) {
                const query2 = request.query.query;
                q2.andWhere(`auther.username like '%${query2}%' or auther.first_name like '%${query2}%' or auther.last_name like '%${query2}%' or reciverUser.location like '%${query2}%'`)
            }

            const [friendsRequestsFromUser, count2] = await q2.getManyAndCount();

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
            /**
             * socket work here
             */
            // mean he is get his friends from wall page
            if (profile.slug === request['user'].username) {
                const io = request.app.get('io');
                const socketID = request.cookies.io;
                console.log('from friends');
                console.log(socketID);
                // console.log(io);
                if (socketID) {
                    results.forEach(f => {
                        io.sockets.connected[socketID].join(f.room, () => {
                            console.log('joined ' + f.room);
                        })
                    });
                }
                // io.to('test9-toni2-PXVTY').emit('message','hi from join');

            }
            const count = count1 + count2;

            return response.status(200).send({ results, count: parseInt(count.toString(), 10) });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    /**
    * @Get 
    */
    async getSuggestedFriends(request, response: Response, next: NextFunction) {
        const profileRepository = getRepository(Profile);
        try {
            const profile = await profileRepository.findOne({ slug: request['user'].username });
            const friends: any = await getAllFriendSharedBtwnApp(request, response, profile.slug);
            const friendsArray = friends.map(e => e.pk);
            // not get my profile
            friendsArray.push(profile.id);
            const [notFriends, count] = await profileRepository.createQueryBuilder('p')
                .innerJoin('p.user', 'user')
                .select(['p.id', 'p.slug', 'p.avatar', 'user.first_name', 'user.last_name', 'user.email'])
                .where(`p.id NOT IN (${friendsArray})`)
                .orderBy('p.id', 'DESC')
                .getManyAndCount();

            let results: any = notFriends.map(e => {
                const resObject = {
                    pk: e.id,
                    slug: e.slug,
                    avatar: e.avatar,
                    auth_user: { ...e.user }
                }
                delete e.user;
                return resObject;
            });
            results = _.sample(results, 10);
            return response.status(200).send({ results, count: 10 });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }



}



/////////////////////////////////////// reuseable ///////////////////
/**
   * @Get 
   */
export async function getAllFriendSharedBtwnApp(request, response: Response, slug) {
    const profileRepository = getRepository(Profile);
    const friendsRepository = getRepository(FriendshipFriend).createQueryBuilder('f');
    try {
        const profile = await profileRepository.findOne({ slug });

        const q1 = friendsRepository
            .innerJoin('f.fromUser', 'senderUser')
            .innerJoin('f.toUser', 'reciverUser')
            .innerJoinAndMapOne('f.senderUserObject', User, 'autherSender', 'autherSender.id = senderUser.userId')
            .innerJoinAndMapOne('f.reciverUserObject', User, 'autherReciver', 'autherReciver.id = reciverUser.userId')
            // .addSelect(
            //     ['senderUser.id', 'senderUser.slug', 'senderUser.avatar', 'senderUser.user', 'f.room',
            //         'reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar', 'reciverUser.user', 'f.room'
            //     ])
            .addSelect(['senderUser.id', 'senderUser.slug', 'reciverUser.slug', 'reciverUser.id'])
            .where(`f.toUser = ${profile.id}`)
            .orWhere(`f.fromUser = ${profile.id}`);

        // // search friends 
        // if (request.query.query) {
        //     const query = request.query.query;
        //     q1.andWhere(`autherSender.username like '%${query}%' or autherSender.first_name like '%${query}%' or autherSender.last_name like '%${query}%' or senderUser.location like '%${query}%'`);
        //     q1.andWhere(`autherReciver.username like '%${query}%' or autherReciver.first_name like '%${query}%' or autherReciver.last_name like '%${query}%' or reciverUser.location like '%${query}%'`)

        // }


        const [friends, count] = await q1.getManyAndCount();
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
            const senderUserObject: any = e['senderUserObject'];
            const reciverUserObject: any = e['reciverUserObject'];
            if (senderUserObject.username === profile.slug) {
                //// not used so  let's simplify the response
                // auther1 is the same profile searched ... no not wanted here
                // formatedREsponse.username = reciverUserObject.username;
                // formatedREsponse.first_name = reciverUserObject.first_name;
                // formatedREsponse.last_name = reciverUserObject.last_name;
                // formatedREsponse.email = reciverUserObject.email;
                // formatedREsponse.username = reciverUserObject.username;
                formatedREsponse.pk = notSameUser.id;
                // formatedREsponse.avatar = notSameUser.avatar;
                // formatedREsponse.slug = notSameUser.slug;
                // formatedREsponse.room = e.room;
            } else {
                // formatedREsponse.username = senderUserObject.username;
                // formatedREsponse.first_name = senderUserObject.first_name;
                // formatedREsponse.last_name = senderUserObject.last_name;
                // formatedREsponse.email = senderUserObject.email;
                // formatedREsponse.username = senderUserObject.username;
                formatedREsponse.pk = notSameUser.id;
                // formatedREsponse.avatar = notSameUser.avatar;
                // formatedREsponse.slug = notSameUser.slug;
                // formatedREsponse.room = e.room;
            }
            return formatedREsponse;
        });
        return results;
    } catch (error) {
        const err = error[0] ? Object.values(error[0].constraints) : [error.message];
        return response.status(400).send({ success: false, error: err });

    }


}