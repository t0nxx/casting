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
const activity_attachment_1 = require("./activity_attachment");
let profile_album = class profile_album {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], profile_album.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], profile_album.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 150,
        name: "album_name"
    }),
    __metadata("design:type", String)
], profile_album.prototype, "album_name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileAlbums, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_album.prototype, "userProfile", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_attachment_1.activity_attachment, (activity_attachment) => activity_attachment.album),
    __metadata("design:type", Array)
], profile_album.prototype, "activityAttachments", void 0);
profile_album = __decorate([
    typeorm_1.Entity("profile_album", { schema: "public" }),
    typeorm_1.Index("profile_album_album_name_user_profile_id_0d8a9ffa_uniq", ["album_name", "userProfile",], { unique: true }),
    typeorm_1.Index("profile_album_user_profile_id_3fd4bbd4", ["userProfile",])
], profile_album);
exports.profile_album = profile_album;
//# sourceMappingURL=profile_album.js.map