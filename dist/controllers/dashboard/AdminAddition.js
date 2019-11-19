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
const auth_user_1 = require("../../models/newModels/auth_user");
class AdminAdditionController {
    getAllUsers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const [data, count] = yield userRepository.findAndCount({
                    select: ['id', 'isAdmin', 'first_name', 'last_name', 'email', 'username'],
                    order: { id: 'DESC' }
                });
                return response.status(200).send({ data, count });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    getOneUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const data = yield userRepository.findOne({ id: parseInt(request.params.id, 10) }, {
                    select: ['id', 'isAdmin', 'first_name', 'last_name', 'email', 'username'],
                    order: { id: 'DESC' }
                });
                if (!data) {
                    throw new Error('User not found');
                }
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    updateUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const user = yield userRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!user) {
                    throw new Error('User not found');
                }
                yield userRepository.update({ id: parseInt(request.params.id, 10) }, request.body);
                const data = yield userRepository.findOne({ id: parseInt(request.params.id, 10) });
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    deleteUser(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = typeorm_1.getRepository(auth_user_1.User);
            try {
                const data = yield userRepository.findOne({ id: parseInt(request.params.id, 10) });
                if (!data) {
                    throw new Error('User not found');
                }
                yield userRepository.delete({ id: parseInt(request.params.id, 10) });
                return response.status(200).send({ data });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.AdminAdditionController = AdminAdditionController;
//# sourceMappingURL=AdminAddition.js.map