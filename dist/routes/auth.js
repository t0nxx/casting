"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const router = express_1.Router();
const authController = new AuthController_1.AuthController();
router.post('/login', authController.login);
router.post('/registration', authController.signUp);
router.post('/password/change', AuthMiddleWare_1.AuthMiddleWare, authController.changePassword);
exports.default = router;
//# sourceMappingURL=auth.js.map