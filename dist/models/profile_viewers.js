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
let profile_viewers = class profile_viewers {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], profile_viewers.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileViewerss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_viewers.prototype, "userProfile", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileViewerss2, {}),
    typeorm_1.JoinColumn({ name: 'visitor_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_viewers.prototype, "visitorProfile", void 0);
profile_viewers = __decorate([
    typeorm_1.Entity("profile_viewers", { schema: "public" }),
    typeorm_1.Index("profile_viewers_user_profile_id_b15d1f54", ["userProfile",]),
    typeorm_1.Index("profile_viewers_visitor_profile_id_e86c6562", ["visitorProfile",])
], profile_viewers);
exports.profile_viewers = profile_viewers;
//# sourceMappingURL=profile_viewers.js.map