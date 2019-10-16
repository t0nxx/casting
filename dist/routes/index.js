"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ProfileRoute_1 = require("./ProfileRoute");
const auth_1 = require("./auth");
const routes = express_1.Router();
routes.use('/auth', auth_1.default);
routes.use('/profile', ProfileRoute_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map