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
const build_lookup_1 = require("./build_lookup");
const ethnicities_lookup_1 = require("./ethnicities_lookup");
const eye_lookup_1 = require("./eye_lookup");
const hair_lookup_1 = require("./hair_lookup");
const height_range_lookup_1 = require("./height_range_lookup");
const weight_range_lookup_1 = require("./weight_range_lookup");
const company_1 = require("./company");
const job_applicants_1 = require("./job_applicants");
const job_schedules_1 = require("./job_schedules");
const job_shortlisted_1 = require("./job_shortlisted");
const profile_album_1 = require("./profile_album");
const profile_hobbies_1 = require("./profile_hobbies");
const profile_settings_1 = require("./profile_settings");
const profile_social_networks_1 = require("./profile_social_networks");
const profile_training_1 = require("./profile_training");
const profile_viewers_1 = require("./profile_viewers");
const users_profile_categories_1 = require("./users_profile_categories");
let users_profile = class users_profile {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], users_profile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 150,
        name: "avatar"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 150,
        name: "cover"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "cover", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "gender"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "gender", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 150,
        name: "location"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "location", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "about"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "about", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        unique: true,
        length: 50,
        name: "phone"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "phone", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 50,
        name: "slug"
    }),
    __metadata("design:type", String)
], users_profile.prototype, "slug", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "age_from"
    }),
    __metadata("design:type", Number)
], users_profile.prototype, "age_from", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.usersProfiles, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], users_profile.prototype, "authUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => build_lookup_1.build_lookup, (build_lookup) => build_lookup.usersProfiles, {}),
    typeorm_1.JoinColumn({ name: 'build_id' }),
    __metadata("design:type", build_lookup_1.build_lookup)
], users_profile.prototype, "build", void 0);
__decorate([
    typeorm_1.ManyToOne(() => ethnicities_lookup_1.ethnicities_lookup, (ethnicities_lookup) => ethnicities_lookup.usersProfiles, {}),
    typeorm_1.JoinColumn({ name: 'ethnicity_id' }),
    __metadata("design:type", ethnicities_lookup_1.ethnicities_lookup)
], users_profile.prototype, "ethnicity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => eye_lookup_1.eye_lookup, (eye_lookup) => eye_lookup.usersProfiles, {}),
    typeorm_1.JoinColumn({ name: 'eye_id' }),
    __metadata("design:type", eye_lookup_1.eye_lookup)
], users_profile.prototype, "eye", void 0);
__decorate([
    typeorm_1.ManyToOne(() => hair_lookup_1.hair_lookup, (hair_lookup) => hair_lookup.usersProfiles, {}),
    typeorm_1.JoinColumn({ name: 'hair_id' }),
    __metadata("design:type", hair_lookup_1.hair_lookup)
], users_profile.prototype, "hair", void 0);
__decorate([
    typeorm_1.ManyToOne(() => height_range_lookup_1.height_range_lookup, (height_range_lookup) => height_range_lookup.usersProfiles, {}),
    typeorm_1.JoinColumn({ name: 'height_id' }),
    __metadata("design:type", height_range_lookup_1.height_range_lookup)
], users_profile.prototype, "height", void 0);
__decorate([
    typeorm_1.ManyToOne(() => weight_range_lookup_1.weight_range_lookup, (weight_range_lookup) => weight_range_lookup.usersProfiles, {}),
    typeorm_1.JoinColumn({ name: 'weight_id' }),
    __metadata("design:type", weight_range_lookup_1.weight_range_lookup)
], users_profile.prototype, "weight", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "age_to"
    }),
    __metadata("design:type", Number)
], users_profile.prototype, "age_to", void 0);
__decorate([
    typeorm_1.OneToMany(() => company_1.company, (company) => company.profile),
    __metadata("design:type", Array)
], users_profile.prototype, "companys", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_applicants_1.job_applicants, (job_applicants) => job_applicants.profile),
    __metadata("design:type", Array)
], users_profile.prototype, "jobApplicantss", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_schedules_1.job_schedules, (job_schedules) => job_schedules.profile),
    __metadata("design:type", Array)
], users_profile.prototype, "jobScheduless", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_shortlisted_1.job_shortlisted, (job_shortlisted) => job_shortlisted.profile),
    __metadata("design:type", Array)
], users_profile.prototype, "jobShortlisteds", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_album_1.profile_album, (profile_album) => profile_album.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileAlbums", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_hobbies_1.profile_hobbies, (profile_hobbies) => profile_hobbies.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileHobbiess", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_settings_1.profile_settings, (profile_settings) => profile_settings.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileSettingss", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_social_networks_1.profile_social_networks, (profile_social_networks) => profile_social_networks.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileSocialNetworkss", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_training_1.profile_training, (profile_training) => profile_training.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileTrainings", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_viewers_1.profile_viewers, (profile_viewers) => profile_viewers.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileViewerss", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_viewers_1.profile_viewers, (profile_viewers) => profile_viewers.visitorProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "profileViewerss2", void 0);
__decorate([
    typeorm_1.OneToMany(() => users_profile_categories_1.users_profile_categories, (users_profile_categories) => users_profile_categories.userProfile),
    __metadata("design:type", Array)
], users_profile.prototype, "usersProfileCategoriess", void 0);
users_profile = __decorate([
    typeorm_1.Entity("users_profile", { schema: "public" }),
    typeorm_1.Index("users_profile_auth_user_id_6e00984f", ["authUser",]),
    typeorm_1.Index("users_profile_build_id_5c61d7f6", ["build",]),
    typeorm_1.Index("users_profile_ethnicity_id_f8c974d4", ["ethnicity",]),
    typeorm_1.Index("users_profile_eye_id_0cae2b23", ["eye",]),
    typeorm_1.Index("users_profile_hair_id_21319060", ["hair",]),
    typeorm_1.Index("users_profile_height_id_f83e4305", ["height",]),
    typeorm_1.Index("users_profile_phone_key", ["phone",], { unique: true }),
    typeorm_1.Index("users_profile_phone_0ff15728_like", ["phone",]),
    typeorm_1.Index("users_profile_slug_809f9137", ["slug",]),
    typeorm_1.Index("users_profile_slug_809f9137_like", ["slug",]),
    typeorm_1.Index("users_profile_weight_id_fabe992c", ["weight",])
], users_profile);
exports.users_profile = users_profile;
//# sourceMappingURL=users_profile.js.map