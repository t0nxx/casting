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
const Secrets_1 = require("../config/Secrets");
function generateJwtToken(args) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield jsonwebtoken_1.sign(args, Secrets_1.JWTSECRET, { expiresIn: '60d' });
    });
}
exports.generateJwtToken = generateJwtToken;
//# sourceMappingURL=GnerateJwt.js.map