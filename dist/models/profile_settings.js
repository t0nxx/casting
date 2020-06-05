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
var settingsView;
(function (settingsView) {
    settingsView["ONLY_FRIENDS"] = "ONLY_FRIENDS";
    settingsView["COMPANY"] = "COMPANY";
    settingsView["ALL"] = "ALL";
})(settingsView = exports.settingsView || (exports.settingsView = {}));
var myStatus;
(function (myStatus) {
    myStatus["ONLINE"] = "ONLINE";
    myStatus["OFFLINE"] = "OFFLINE";
})(myStatus = exports.myStatus || (exports.myStatus = {}));
let ProfileSettings = class ProfileSettings {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProfileSettings.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_see_profile", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_see_wall", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_comment", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_contact_info", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_send_message", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_see_friends", void 0);
__decorate([
    typeorm_1.Column({ default: settingsView.ALL }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "can_see_phone", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], ProfileSettings.prototype, "response_all_time", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", Date)
], ProfileSettings.prototype, "response_from", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", Date)
], ProfileSettings.prototype, "response_to", void 0);
__decorate([
    typeorm_1.Column('longtext'),
    __metadata("design:type", String)
], ProfileSettings.prototype, "response_message", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], ProfileSettings.prototype, "auto_play_video", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], ProfileSettings.prototype, "jobs_notification", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], ProfileSettings.prototype, "mute_all_chats", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], ProfileSettings.prototype, "sound_alert", void 0);
__decorate([
    typeorm_1.Column({ default: myStatus.ONLINE }),
    __metadata("design:type", String)
], ProfileSettings.prototype, "my_status", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ProfileSettings.prototype, "latest_action", void 0);
__decorate([
    typeorm_1.OneToOne(type => users_profile_1.Profile, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", users_profile_1.Profile)
], ProfileSettings.prototype, "profile", void 0);
ProfileSettings = __decorate([
    typeorm_1.Entity('profile_settings')
], ProfileSettings);
exports.ProfileSettings = ProfileSettings;
//# sourceMappingURL=profile_settings.js.map