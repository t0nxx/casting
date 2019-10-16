"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileController_1 = require("../controllers/ProfileController");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const router = express_1.Router();
const profileController = new ProfileController_1.ProfileController();
router.get('/:slug', profileController.getProfile);
router.get('/:slug/settings', profileController.getProfileSettings);
router.get('/', profileController.all);
router.patch('/:slug/update', AuthMiddleWare_1.AuthMiddleWare, profileController.updateProfile);
exports.default = router;
//# sourceMappingURL=ProfileRoute.js.map