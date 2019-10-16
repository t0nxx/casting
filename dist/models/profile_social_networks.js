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
const users_profile_1 = require("./users_profile");
let profile_social_networks = class profile_social_networks {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], profile_social_networks.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "network"
    }),
    __metadata("design:type", String)
], profile_social_networks.prototype, "network", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        unique: true,
        length: 200,
        name: "url"
    }),
    __metadata("design:type", String)
], profile_social_networks.prototype, "url", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileSocialNetworkss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_social_networks.prototype, "userProfile", void 0);
profile_social_networks = __decorate([
    typeorm_1.Entity("profile_social_networks", { schema: "public" }),
    typeorm_1.Index("profile_social_networks_url_key", ["url",], { unique: true }),
    typeorm_1.Index("profile_social_networks_url_5eb066ea_like", ["url",]),
    typeorm_1.Index("profile_social_networks_user_profile_id_9a07152a", ["userProfile",])
], profile_social_networks);
exports.profile_social_networks = profile_social_networks;
//# sourceMappingURL=profile_social_networks.js.map