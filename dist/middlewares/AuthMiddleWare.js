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
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const Secrets_1 = require("../config/Secrets");
const auth_user_1 = require("../models/newModels/auth_user");
exports.AuthMiddleWare = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    const userRepository = typeorm_1.getRepository(auth_user_1.User);
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new Error('Not authorized');
        }
        const decode = yield jsonwebtoken_1.verify(token, Secrets_1.JWTSECRET);
        const user = yield userRepository.findOne({ id: decode.id });
        if (!user) {
            throw new Error('Not authorized');
        }
        req.user = user;
        next();
    }
    catch (error) {
        const err = error[0] ? Object.values(error[0].constraints) : [error.message];
        return res.status(401).send({ success: false, error: err });
    }
});
//# sourceMappingURL=AuthMiddleWare.js.map