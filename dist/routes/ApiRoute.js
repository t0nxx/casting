"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TalentCategoriesController_1 = require("../controllers/api/TalentCategoriesController");
const AuthController_1 = require("../controllers/AuthController");
const router = express_1.Router();
const talentController = new TalentCategoriesController_1.TalentCategoriesController();
const authController = new AuthController_1.AuthController();
router.get('/talent-categories', talentController.getAllTalentCategories);
router.post('/new-category', talentController.createNewCategory);
router.post('/verifyusernameemail', authController.verifyEmailAndUsernamIsAvailable);
exports.default = router;
//# sourceMappingURL=ApiRoute.js.map