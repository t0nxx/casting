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
const auth_user_1 = require("./auth_user");
let activity_attachment = class activity_attachment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], activity_attachment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], activity_attachment.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "path"
    }),
    __metadata("design:type", String)
], activity_attachment.prototype, "path", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 25,
        name: "type"
    }),
    __metadata("design:type", String)
], activity_attachment.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.activity, (activity) => activity.activityAttachments, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'activity_id' }),
    __metadata("design:type", activity_1.activity)
], activity_attachment.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => profile_album_1.profile_album, (profile_album) => profile_album.activityAttachments, {}),
    typeorm_1.JoinColumn({ name: 'album_id' }),
    __metadata("design:type", profile_album_1.profile_album)
], activity_attachment.prototype, "album", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.activityAttachments, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], activity_attachment.prototype, "authUser", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 150,
        name: "path_json"
    }),
    __metadata("design:type", String)
], activity_attachment.prototype, "path_json", void 0);
activity_attachment = __decorate([
    typeorm_1.Entity("activity_attachment", { schema: "public" }),
    typeorm_1.Index("activity_attachment_activity_id_306ddcd5", ["activity",]),
    typeorm_1.Index("activity_attachment_album_id_66267b17", ["album",]),
    typeorm_1.Index("activity_attachment_auth_user_id_7433c68f", ["authUser",])
], activity_attachment);
exports.activity_attachment = activity_attachment;
//# sourceMappingURL=activity_attachment.js.map