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
let profile_settings = class profile_settings {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], profile_settings.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "can_see_profile"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "can_see_profile", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "can_see_wall"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "can_see_wall", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "can_comment"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "can_comment", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "can_contact_info"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "can_contact_info", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "can_send_message"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "can_send_message", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "response_all_time"
    }),
    __metadata("design:type", Boolean)
], profile_settings.prototype, "response_all_time", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "response_from"
    }),
    __metadata("design:type", Date)
], profile_settings.prototype, "response_from", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "response_to"
    }),
    __metadata("design:type", Date)
], profile_settings.prototype, "response_to", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "response_message"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "response_message", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "auto_play_video"
    }),
    __metadata("design:type", Boolean)
], profile_settings.prototype, "auto_play_video", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "jobs_notification"
    }),
    __metadata("design:type", Boolean)
], profile_settings.prototype, "jobs_notification", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileSettingss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_settings.prototype, "userProfile", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "can_see_friends"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "can_see_friends", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "my_status"
    }),
    __metadata("design:type", String)
], profile_settings.prototype, "my_status", void 0);
profile_settings = __decorate([
    typeorm_1.Entity("profile_settings", { schema: "public" }),
    typeorm_1.Index("profile_settings_user_profile_id_1e134e75", ["userProfile",])
], profile_settings);
exports.profile_settings = profile_settings;
//# sourceMappingURL=profile_settings.js.map