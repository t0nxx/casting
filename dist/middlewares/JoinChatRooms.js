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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const Secrets_1 = require("../config/Secrets");
const auth_user_1 = require("../models/auth_user");
const chat_room_1 = require("../models/chat_room");
const users_profile_1 = require("../models/users_profile");
exports.JoinChatRooms = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(auth_user_1.User);
    const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
    const ChatRoomRepository = typeorm_1.getRepository(chat_room_1.ChatRoom);
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('Not authorized');
            }
            const decode = yield jsonwebtoken_1.verify(token, Secrets_1.JWTSECRET);
            const profile = yield profileRepository.findOne({
                where: {
                    user: decode.id,
                }
            });
            if (!profile) {
                next();
            }
            const subscribedRooms = yield ChatRoomRepository.find({
                where: [
                    { participant1: profile },
                    { participant2: profile }
                ],
            });
            const io = req.app.get('io');
            const socketID = req.cookies.io;
            if (socketID) {
                subscribedRooms.forEach(room => {
                    io.sockets.connected[socketID].join(room.name, () => {
                    });
                });
            }
            next();
        }
        else {
            next();
        }
    }
    catch (error) {
        next();
    }
});
//# sourceMappingURL=JoinChatRooms.js.map