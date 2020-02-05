import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { JWTSECRET } from '../config/Secrets';
import { User } from '../models/newModels/auth_user';
import { ChatRoom } from '../models/newModels/chat_room';
import { Profile } from '../models/newModels/users_profile';

// this is optional middle ware
export const JoinChatRooms = async (req, res: Response, next: NextFunction) => {
    const userRepository = getRepository(User);
    const profileRepository = getRepository(Profile);
    const ChatRoomRepository = getRepository(ChatRoom);
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) { throw new Error('Not authorized'); }
            const decode: any = await verify(token, JWTSECRET);
            // const user = await userRepository.findOne({ id: decode.id }, { select: ['username'] });
            const profile = await profileRepository.findOne({
                where: {
                    user: decode.id,
                }
            })
            const subscribedRooms = await ChatRoomRepository.find({
                where: [
                    { participant1: profile },
                    { participant2: profile }
                ],
            });
            // console.log('*****************************************')
            // console.log(subscribedRooms);

            // join rooms 
            const io = req.app.get('io');
            const socketID = req.cookies.io;
            if (socketID) {
                subscribedRooms.forEach(room => {
                    io.sockets.connected[socketID].join(room.name, () => {
                        console.log('joined ' + room.name);
                    })
                });
            }
            next();
        } else {
            next();
        }

    } catch (error) {
        /**
              * if ther error from class validator , return first object . else message of error
              */
        const err = error[0] ? Object.values(error[0].constraints) : [error.message];
        return res.status(401).send({ success: false, error: err });
    }
}









//  if (profile.slug === request['user'].username) {
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