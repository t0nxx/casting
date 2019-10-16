"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const auth_user_1 = require("./auth_user");
let authtoken_token = class authtoken_token {
};
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        primary: true,
        length: 40,
        name: "key"
    }),
    __metadata("design:type", String)
], authtoken_token.prototype, "key", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], authtoken_token.prototype, "created", void 0);
__decorate([
    typeorm_1.OneToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.authtokenToken, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], authtoken_token.prototype, "user", void 0);
authtoken_token = __decorate([
    typeorm_1.Entity("authtoken_token", { schema: "public" }),
    typeorm_1.Index("authtoken_token_key_10f0b77e_like", ["key",]),
    typeorm_1.Index("authtoken_token_user_id_key", ["user",], { unique: true })
], authtoken_token);
exports.authtoken_token = authtoken_token;
//# sourceMappingURL=authtoken_token.js.map