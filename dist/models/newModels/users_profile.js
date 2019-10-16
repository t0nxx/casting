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
const profile_settings_1 = require("./profile_settings");
let Profile = class Profile {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Profile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: 'https://news-app-uploads.s3.eu-central-1.amazonaws.com/1567899027453 - download.png' }),
    __metadata("design:type", String)
], Profile.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({ default: 'https://news-app-uploads.s3.eu-central-1.amazonaws.com/1567899027453 - download.png' }),
    __metadata("design:type", String)
], Profile.prototype, "cover", void 0);
__decorate([
    typeorm_1.Column({ default: 'Not Provided' }),
    __metadata("design:type", String)
], Profile.prototype, "gender", void 0);
__decorate([
    typeorm_1.Column({ default: 'Not Provided' }),
    __metadata("design:type", String)
], Profile.prototype, "location", void 0);
__decorate([
    typeorm_1.Column({ default: 'Not Provided' }),
    __metadata("design:type", String)
], Profile.prototype, "about", void 0);
__decorate([
    typeorm_1.Column({ default: 'Not Provided' }),
    __metadata("design:type", String)
], Profile.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column({ nullable: false, unique: true }),
    __metadata("design:type", String)
], Profile.prototype, "slug", void 0);
__decorate([
    typeorm_1.Column({ default: 5 }),
    __metadata("design:type", Number)
], Profile.prototype, "age_from", void 0);
__decorate([
    typeorm_1.Column({ default: 100 }),
    __metadata("design:type", Number)
], Profile.prototype, "age_to", void 0);
__decorate([
    typeorm_1.ManyToOne(type => auth_user_1.User, user => user.profiles, { onDelete: 'CASCADE' }),
    __metadata("design:type", auth_user_1.User)
], Profile.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(type => profile_settings_1.ProfileSettings, pS => pS.profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", profile_settings_1.ProfileSettings)
], Profile.prototype, "settings", void 0);
Profile = __decorate([
    typeorm_1.Entity('users_profile')
], Profile);
exports.Profile = Profile;
//# sourceMappingURL=users_profile.js.map