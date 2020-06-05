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
const typeorm_1 = require("typeorm");
const news_letter_1 = require("../../models/news_letter");
const class_transformer_validator_1 = require("class-transformer-validator");
const sendMail_1 = require("../../helpers/sendMail");
class NewsLetterController {
    getAllNewsLetterUsers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsLetterRepository = typeorm_1.getRepository(news_letter_1.NewsLetter);
            try {
                const data = yield newsLetterRepository.find();
                return response.status(200).send(data);
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    subscribeToNewsLetter(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const newsLetterRepository = typeorm_1.getRepository(news_letter_1.NewsLetter);
            try {
                const validateBody = yield class_transformer_validator_1.transformAndValidate(news_letter_1.NewsLetter, request.body);
                const isExist = yield newsLetterRepository.findOne({ email: request.body.email });
                if (isExist) {
                    throw new Error('email is already subscribed');
                }
                const newSub = new news_letter_1.NewsLetter();
                Object.assign(newSub, validateBody);
                const data = yield newsLetterRepository.save(newSub);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
    inviteToCasting(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!request.body.email) {
                    throw new Error('email is required');
                }
                sendMail_1.sendInviteMail(request.body.email);
                return response.status(200).send({ success: true });
            }
            catch (error) {
                const err = error[0] ? Object.values(error[0].constraints) : [error.message];
                return response.status(400).send({ success: false, error: err });
            }
        });
    }
}
exports.NewsLetterController = NewsLetterController;
//# sourceMappingURL=NewsLetterController.js.map