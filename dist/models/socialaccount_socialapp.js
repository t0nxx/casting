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
const socialaccount_socialapp_sites_1 = require("./socialaccount_socialapp_sites");
const socialaccount_socialtoken_1 = require("./socialaccount_socialtoken");
let socialaccount_socialapp = class socialaccount_socialapp {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], socialaccount_socialapp.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 30,
        name: "provider"
    }),
    __metadata("design:type", String)
], socialaccount_socialapp.prototype, "provider", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 40,
        name: "name"
    }),
    __metadata("design:type", String)
], socialaccount_socialapp.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 191,
        name: "client_id"
    }),
    __metadata("design:type", String)
], socialaccount_socialapp.prototype, "client_id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 191,
        name: "secret"
    }),
    __metadata("design:type", String)
], socialaccount_socialapp.prototype, "secret", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 191,
        name: "key"
    }),
    __metadata("design:type", String)
], socialaccount_socialapp.prototype, "key", void 0);
__decorate([
    typeorm_1.OneToMany(() => socialaccount_socialapp_sites_1.socialaccount_socialapp_sites, (socialaccount_socialapp_sites) => socialaccount_socialapp_sites.socialapp),
    __metadata("design:type", Array)
], socialaccount_socialapp.prototype, "socialaccountSocialappSitess", void 0);
__decorate([
    typeorm_1.OneToMany(() => socialaccount_socialtoken_1.socialaccount_socialtoken, (socialaccount_socialtoken) => socialaccount_socialtoken.app),
    __metadata("design:type", Array)
], socialaccount_socialapp.prototype, "socialaccountSocialtokens", void 0);
socialaccount_socialapp = __decorate([
    typeorm_1.Entity("socialaccount_socialapp", { schema: "public" })
], socialaccount_socialapp);
exports.socialaccount_socialapp = socialaccount_socialapp;
//# sourceMappingURL=socialaccount_socialapp.js.map