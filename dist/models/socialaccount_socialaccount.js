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
const socialaccount_socialtoken_1 = require("./socialaccount_socialtoken");
let socialaccount_socialaccount = class socialaccount_socialaccount {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], socialaccount_socialaccount.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 30,
        name: "provider"
    }),
    __metadata("design:type", String)
], socialaccount_socialaccount.prototype, "provider", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 191,
        name: "uid"
    }),
    __metadata("design:type", String)
], socialaccount_socialaccount.prototype, "uid", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "last_login"
    }),
    __metadata("design:type", Date)
], socialaccount_socialaccount.prototype, "last_login", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "date_joined"
    }),
    __metadata("design:type", Date)
], socialaccount_socialaccount.prototype, "date_joined", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "extra_data"
    }),
    __metadata("design:type", String)
], socialaccount_socialaccount.prototype, "extra_data", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.socialaccountSocialaccounts, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], socialaccount_socialaccount.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => socialaccount_socialtoken_1.socialaccount_socialtoken, (socialaccount_socialtoken) => socialaccount_socialtoken.account),
    __metadata("design:type", Array)
], socialaccount_socialaccount.prototype, "socialaccountSocialtokens", void 0);
socialaccount_socialaccount = __decorate([
    typeorm_1.Entity("socialaccount_socialaccount", { schema: "public" }),
    typeorm_1.Index("socialaccount_socialaccount_provider_uid_fc810c6e_uniq", ["provider", "uid",], { unique: true }),
    typeorm_1.Index("socialaccount_socialaccount_user_id_8146e70c", ["user",])
], socialaccount_socialaccount);
exports.socialaccount_socialaccount = socialaccount_socialaccount;
//# sourceMappingURL=socialaccount_socialaccount.js.map