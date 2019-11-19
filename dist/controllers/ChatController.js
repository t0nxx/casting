"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const users_profile_1 = require("../models/newModels/users_profile");
const friendship_friend_1 = require("../models/newModels/friendship_friend");
const chat_1 = require("../models/newModels/chat");
const pagination_1 = require("../helpers/pagination");
class ChatController {
    sendMessage(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const firendsRepository = typeorm_1.getRepository(friendship_friend_1.FriendshipFriend);
            try {
                const sender = yield profileRepository.findOne({ slug: request['user'].username });
                const isRoomExist = yield firendsRepository.findOne({ room: request.params.room });
                if (!isRoomExist) {
                    throw new Error('Room Not Found');
                }
                const newMessage = new chat_1.Chat();
                newMessage.sender = sender;
                newMessage.room = request.params.room;
                newMessage.message = request.body.message || '';
                const create = yield ChatRepository.save(newMessage);
                const io = request.app.get('io');
                io.to(request.params.room).emit('message', { room: request.params.room });
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getAllMessage(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const profileRepository = typeorm_1.getRepository(users_profile_1.Profile);
            const ChatRepository = typeorm_1.getRepository(chat_1.Chat);
            const user = yield profileRepository.findOne({ slug: request['user'].username });
            const q = ChatRepository.createQueryBuilder('chat')
                .leftJoin('chat.sender', 'sender')
                .addSelect(['sender.id', 'sender.slug', 'sender.avatar'])
                .where(`chat.room like '${request.params.room}'`)
                .orderBy('chat.id', 'DESC');
            return pagination_1.ApplyPagination(request, response, q, true);
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=ChatController.js.map