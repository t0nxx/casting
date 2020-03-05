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
const socialaccount_socialaccount_1 = require("./socialaccount_socialaccount");
const socialaccount_socialapp_1 = require("./socialaccount_socialapp");
let socialaccount_socialtoken = class socialaccount_socialtoken {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], socialaccount_socialtoken.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "token"
    }),
    __metadata("design:type", String)
], socialaccount_socialtoken.prototype, "token", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "token_secret"
    }),
    __metadata("design:type", String)
], socialaccount_socialtoken.prototype, "token_secret", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "expires_at"
    }),
    __metadata("design:type", Date)
], socialaccount_socialtoken.prototype, "expires_at", void 0);
__decorate([
    typeorm_1.ManyToOne(() => socialaccount_socialaccount_1.socialaccount_socialaccount, (socialaccount_socialaccount) => socialaccount_socialaccount.socialaccountSocialtokens, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'account_id' }),
    __metadata("design:type", socialaccount_socialaccount_1.socialaccount_socialaccount)
], socialaccount_socialtoken.prototype, "account", void 0);
__decorate([
    typeorm_1.ManyToOne(() => socialaccount_socialapp_1.socialaccount_socialapp, (socialaccount_socialapp) => socialaccount_socialapp.socialaccountSocialtokens, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'app_id' }),
    __metadata("design:type", socialaccount_socialapp_1.socialaccount_socialapp)
], socialaccount_socialtoken.prototype, "app", void 0);
socialaccount_socialtoken = __decorate([
    typeorm_1.Entity("socialaccount_socialtoken", { schema: "public" }),
    typeorm_1.Index("socialaccount_socialtoken_account_id_951f210e", ["account",]),
    typeorm_1.Index("socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq", ["account", "app",], { unique: true }),
    typeorm_1.Index("socialaccount_socialtoken_app_id_636a42d7", ["app",])
], socialaccount_socialtoken);
exports.socialaccount_socialtoken = socialaccount_socialtoken;
//# sourceMappingURL=socialaccount_socialtoken.js.map