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
function ApplyPagination(request, response, q, sendToClient) {
    return __awaiter(this, void 0, void 0, function* () {
        let limit = 10;
        let page = 1;
        if (request.query.page) {
            page = parseInt(request.query.page, 10);
        }
        if (request.query.limit) {
            limit = parseInt(request.query.limit, 10);
        }
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        q.take(limit);
        q.skip(startIndex);
        try {
            const [results, count] = yield q.getManyAndCount();
            const responseObject = {};
            responseObject.results = results;
            responseObject.count = count;
            if (endIndex < count) {
                responseObject.next = `${request.protocol}://${request.get('host')}${request.baseUrl}${request.path}?page=${page + 1}&limit=${limit}`;
            }
            if (sendToClient == true) {
                return response.status(200).send(Object.assign({}, responseObject));
            }
            return responseObject;
        }
        catch (error) {
            const err = error[0] ? Object.values(error[0].constraints) : [error.message];
            return response.status(400).send({ success: false, error: err });
        }
    });
}
exports.ApplyPagination = ApplyPagination;
//# sourceMappingURL=pagination.js.map