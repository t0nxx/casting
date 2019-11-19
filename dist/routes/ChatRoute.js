"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatController_1 = require("../controllers/ChatController");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const router = express_1.Router();
const chatController = new ChatController_1.ChatController();
router.get('/:room', AuthMiddleWare_1.AuthMiddleWare, chatController.getAllMessage);
router.post('/:room', AuthMiddleWare_1.AuthMiddleWare, chatController.sendMessage);
exports.default = router;
//# sourceMappingURL=ChatRoute.js.map