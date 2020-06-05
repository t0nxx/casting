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
const activity_1 = require("./activity");
const profile_album_1 = require("./profile_album");
const users_profile_1 = require("./users_profile");
var AttachmentEnum;
(function (AttachmentEnum) {
    AttachmentEnum["VIEDO"] = "VIDEO";
    AttachmentEnum["AUDIO"] = "AUDIO";
    AttachmentEnum["IMG"] = "IMG";
})(AttachmentEnum = exports.AttachmentEnum || (exports.AttachmentEnum = {}));
let ActivityAttachment = class ActivityAttachment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ActivityAttachment.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ActivityAttachment.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column('text'),
    __metadata("design:type", String)
], ActivityAttachment.prototype, "path", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ActivityAttachment.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(type => activity_1.Activity, a => a.activity_attachment, { onDelete: 'CASCADE' }),
    __metadata("design:type", activity_1.Activity)
], ActivityAttachment.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.activity_attachment, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], ActivityAttachment.prototype, "profile", void 0);
__decorate([
    typeorm_1.ManyToOne(type => profile_album_1.ProfileAlbum, p => p.activity_attachment, { onDelete: 'CASCADE' }),
    __metadata("design:type", profile_album_1.ProfileAlbum)
], ActivityAttachment.prototype, "album", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], ActivityAttachment.prototype, "album_id", void 0);
ActivityAttachment = __decorate([
    typeorm_1.Entity("activity_attachment")
], ActivityAttachment);
exports.ActivityAttachment = ActivityAttachment;
//# sourceMappingURL=activity_attachment.js.map