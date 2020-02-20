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
import { Chat } from '../models/newModels/chat';
import { ChatRoom } from '../models/newModels/chat_room';
import { ProfileSettings } from '../models/newModels/profile_settings';

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
                target_profile_slug: fromUser.slug,
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
        const ChatRepository = getRepository(Chat)
        const ChatRoomRepository = getRepository(ChatRoom)
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
            /// this block mean if friends , then unfriend , after that we should not create a new room
            // to retrive any chat if unfriend
            const isExistingRoom = await ChatRoomRepository.findOne({
                where: [
                    // tslint:disable-next-line: object-literal-shorthand
                    { participant1: toUser, participant2: fromUser },
                    { participant1: fromUser, participant2: toUser }
                ]
            });
            if (isExistingRoom) {
                addNewFriends.room = isExistingRoom.name;
            } else {
                const newRoom = new ChatRoom();
                newRoom.name = fromUser.slug + '-' + toUser.slug + '-' + randomString.generate({ length: 5 });
                newRoom.participant1 = fromUser;
                newRoom.participant2 = toUser;
                newRoom.last_deleted_from_participant1 = new Date();
                newRoom.last_deleted_from_participant2 = new Date();
                const createNewRoom = await ChatRoomRepository.save(newRoom);
                addNewFriends.room = createNewRoom.name;
            }
            /// end block
            const saveNewFriend = await friendsRepository.save(addNewFriends);
            const room = await ChatRoomRepository.findOne({ name: saveNewFriend.room });


            const newMessage = new Chat();
            newMessage.room = room;
            newMessage.sender = fromUser;
            newMessage.recipient = toUser;
            newMessage.message = 'Say hi to your new friend';
            const createMsg1 = await ChatRepository.save(newMessage);

            const newMessage2 = new Chat();
            newMessage.room = room;
            newMessage.sender = toUser;
            newMessage.recipient = fromUser;
            newMessage.message = 'Say hi to your new friend';
            const createMsg2 = await ChatRepository.save(newMessage);




            const notiToQueu: NotificationShape = {
                actor_first_name: toUser.user.first_name,
                actor_last_name: toUser.user.last_name,
                actor_avatar: toUser.avatar,
                type: NotificationTypeEnum.acceptFriendReq,
                target_profile_slug: toUser.slug,
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
                .innerJoinAndMapOne('f2.senderSettings', ProfileSettings, 'senderSettings', 'senderUser.id = senderSettings.profileId')
                .addSelect(['senderUser.id', 'senderUser.slug', 'senderUser.avatar', 'f2.room'])
                .where(`f2.toUserId = ${profile.id}`);

            const q2 = friendsRepository
                .innerJoin('f.toUser', 'reciverUser')
                .innerJoinAndMapOne('f.Auther', User, 'auther', 'auther.id = reciverUser.userId')
                .innerJoinAndMapOne('f.recipientSettings', ProfileSettings, 'recipientSettings', 'reciverUser.id = recipientSettings.profileId')
                .addSelect(['reciverUser.id', 'reciverUser.slug', 'reciverUser.avatar', 'f.room'])
                .where(`f.fromUserId = ${profile.id}`);

            // search friends 
            if (request.query.query) {
                const query1 = request.query.query;
                q1.andWhere(`auther.username like '%${query1}%' or auther.first_name like '%${query1}%' or auther.last_name like '%${query1}%' or senderUser.location like '%${query1}%'`)
                q2.andWhere(`auther.username like '%${query1}%' or auther.first_name like '%${query1}%' or auther.last_name like '%${query1}%' or reciverUser.location like '%${query1}%'`)
            }

            const [
                [friendsRequestsTouser, count1],
                [friendsRequestsFromUser, count2]
            ] = await Promise.all([q1.getManyAndCount(), q2.getManyAndCount()]);

            const res1: any = friendsRequestsTouser.map(e => {
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
                    status: e['senderSettings'].my_status,
                };
                return formatedREsponse1;
            });

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
                    status: e['recipientSettings'].my_status,
                };
                return formatedREsponse1;
            });

            let results = [...res1, ...res2];

            // remove the same user from response 
            results = results.filter(e => e.slug !== profile.slug);

            // remove redundant in search 
            // this is worng , since it retrive not friends also , but now i've made this temporary solution 
            results = results.filter(e => e.room.indexOf(profile.slug) != -1);

            /**
             * socket work here
             */
            // mean he is get his friends from wall page
            //// i 'll replace this with middleware over the whole app
            // if (profile.slug === request['user'].username) {
            //     const io = request.app.get('io');
            //     const socketID = request.cookies.io;
            //     console.log('from friends');
            //     console.log(socketID);
            //     // console.log(io);
            //     if (socketID) {
            //         results.forEach(f => {
            //             io.sockets.connected[socketID].join(f.room, () => {
            //                 console.log('joined ' + f.room);
            //             })
            //         });
            //     }
            //     // io.to('test9-toni2-PXVTY').emit('message','hi from join');

            // }
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


    async makeAllusersFriendWithAdminForDevOnly(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
        const friendsRepository = getRepository(FriendshipFriend);
        const ChatRepository = getRepository(Chat)
        const ChatRoomRepository = getRepository(ChatRoom)
        try {
            const toUser = await profileRepository.findOne({ slug: 'test9' }, { relations: ['user'] });
            // const fromUser = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
            const allUsers = await profileRepository.find({ relations: ['user'] });
            allUsers.map(async fromUser => {
                const addNewFriends = new FriendshipFriend();
                addNewFriends.fromUser = fromUser;
                addNewFriends.toUser = toUser;
                /// this block mean if friends , then unfriend , after that we should not create a new room
                // to retrive any chat if unfriend
                const isExistingRoom = await ChatRoomRepository.findOne({
                    where: [
                        // tslint:disable-next-line: object-literal-shorthand
                        { participant1: toUser, participant2: fromUser },
                        { participant1: fromUser, participant2: toUser }
                    ]
                });
                if (isExistingRoom) {
                    addNewFriends.room = isExistingRoom.name;
                } else {
                    const newRoom = new ChatRoom();
                    newRoom.name = fromUser.slug + '-' + toUser.slug + '-' + randomString.generate({ length: 5 });
                    newRoom.participant1 = fromUser;
                    newRoom.participant2 = toUser;
                    newRoom.last_deleted_from_participant1 = new Date();
                    newRoom.last_deleted_from_participant2 = new Date();
                    const createNewRoom = await ChatRoomRepository.save(newRoom);
                    addNewFriends.room = createNewRoom.name;
                }
                /// end block
                const saveNewFriend = await friendsRepository.save(addNewFriends);
                const room = await ChatRoomRepository.findOne({ name: saveNewFriend.room });


                const newMessage = new Chat();
                newMessage.room = room;
                newMessage.sender = fromUser;
                newMessage.recipient = toUser;
                newMessage.message = 'Say hi to your new friend';
                const createMsg1 = await ChatRepository.save(newMessage);

                const newMessage2 = new Chat();
                newMessage.room = room;
                newMessage.sender = toUser;
                newMessage.recipient = fromUser;
                newMessage.message = 'Say hi to your new friend';
                const createMsg2 = await ChatRepository.save(newMessage);




                // const notiToQueu: NotificationShape = {
                //     actor_first_name: toUser.user.first_name,
                //     actor_last_name: toUser.user.last_name,
                //     actor_avatar: toUser.avatar,
                //     type: NotificationTypeEnum.acceptFriendReq,
                //     target_profile_slug: toUser.slug,
                //     recipient: fromUser.id,
                // }
                // await notificationQueue.add(notiToQueu);
            })




            return response.status(200).send({ success: true });
        } catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });

        }
    }

    async removeAllusersFromFriendWithAdminForDevOnly(request: Request, response: Response) {
        const profileRepository = getRepository(Profile);
        const friendRequestRepository = getRepository(FriendshipFriendshipRequest);
        const friendsRepository = getRepository(FriendshipFriend);
        const ChatRepository = getRepository(Chat)
        const ChatRoomRepository = getRepository(ChatRoom)
        try {
            const adminProfile = await profileRepository.findOne({ slug: 'test9' }, { relations: ['user'] });
            // const fromUser = await profileRepository.findOne({ slug: request.params.slug }, { relations: ['user'] });
            const friendsWithAdmin = await friendsRepository.find({
                where: [
                    { fromUser: adminProfile },
                    { toUser: adminProfile }

                ]
            });
            await friendsRepository.remove(friendsWithAdmin);




            return response.status(200).send({ success: true });
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

