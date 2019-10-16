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
const users_profile_1 = require("../models/users_profile");
class UserController {
    all(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(users_profile_1.users_profile);
            try {
                const data = yield userRepository.find();
                response.status(200).send({ error: false, data: { data } });
            }
            catch (error) {
                response.status(400).send({ error: true, data: error.message });
            }
        });
    }
    one(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(users_profile_1.users_profile);
            try {
                const data = yield userRepository.findOne(request.params.id);
                if (!data)
                    throw new Error('User Not Found');
                response.status(200).send({ error: false, data: { data } });
            }
            catch (error) {
                response.status(400).send({ error: true, data: error.message });
            }
        });
    }
    add(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(users_profile_1.users_profile);
            try {
                const data = yield userRepository.save(request.body);
                response.status(200).send({ error: false, data: { data } });
            }
            catch (error) {
                response.status(400).send({ error: true, data: error.message });
            }
        });
    }
    remove(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(users_profile_1.users_profile);
            try {
                let userToRemove = yield userRepository.findOne(request.params.id);
                const data = yield userRepository.remove(userToRemove);
                response.status(200).send({ error: false, data: { data } });
            }
            catch (error) {
                response.status(400).send({ error: true, data: error.message });
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=defualtSchema.js.map