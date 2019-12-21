"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleWare_1 = require("../middlewares/AuthMiddleWare");
const SearchController_1 = require("../controllers/SearchController");
const router = express_1.Router();
const searchController = new SearchController_1.SearchController();
router.get('/jobs', AuthMiddleWare_1.AuthMiddleWare, searchController.searchJobs);
router.get('/jobs/suitsme', AuthMiddleWare_1.AuthMiddleWare, searchController.getSuitesMeJobs);
router.get('/jobs/applied', AuthMiddleWare_1.AuthMiddleWare, searchController.getMyAppliedJobs);
router.get('/companies', AuthMiddleWare_1.AuthMiddleWare, searchController.searchCompaines);
router.get('/profile', AuthMiddleWare_1.AuthMiddleWare, searchController.searchPeople);
router.get('/companies/followed', AuthMiddleWare_1.AuthMiddleWare, searchController.searchMYFollowedCompaines);
exports.default = router;
//# sourceMappingURL=SearchRoute.js.map