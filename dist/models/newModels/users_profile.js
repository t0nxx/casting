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
const talent_categories_1 = require("./talent_categories");
const weight_range_lookup_1 = require("./weight_range_lookup");
const height_range_lookup_1 = require("./height_range_lookup");
const eye_lookup_1 = require("./eye_lookup");
const hair_lookup_1 = require("./hair_lookup");
const build_lookup_1 = require("./build_lookup");
const ethnicities_lookup_1 = require("./ethnicities_lookup");
const profile_hobbies_1 = require("./profile_hobbies");
const profile_courses_1 = require("./profile_courses");
const profile_social_1 = require("./profile_social");
const company_1 = require("./company");
const activity_attachment_1 = require("./activity_attachment");
const activity_1 = require("./activity");
let Profile = class Profile {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Profile.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: 'https://casting-secret.s3.eu-central-1.amazonaws.com/avatar1.png' }),
    __metadata("design:type", String)
], Profile.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({ default: 'https://casting-secret.s3.eu-central-1.amazonaws.com/banner.jpg' }),
    __metadata("design:type", String)
], Profile.prototype, "cover", void 0);
__decorate([
    typeorm_1.Column({ default: 'male' }),
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
    typeorm_1.ManyToMany(type => talent_categories_1.TalentCategories, { onDelete: 'CASCADE' }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Profile.prototype, "categories", void 0);
__decorate([
    typeorm_1.ManyToMany(type => profile_hobbies_1.Hobbies, { onDelete: 'CASCADE', eager: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Profile.prototype, "users_profile_hobbies", void 0);
__decorate([
    typeorm_1.ManyToMany(type => profile_courses_1.Courses, { onDelete: 'CASCADE', eager: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Profile.prototype, "users_profile_courses", void 0);
__decorate([
    typeorm_1.ManyToMany(type => profile_social_1.ProfileSocialNetworks, { onDelete: 'CASCADE', eager: true }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Profile.prototype, "users_profile_social", void 0);
__decorate([
    typeorm_1.OneToMany(type => company_1.Company, c => c.profile),
    __metadata("design:type", Array)
], Profile.prototype, "companies", void 0);
__decorate([
    typeorm_1.OneToMany(type => company_1.Company, c => c.profile),
    __metadata("design:type", Array)
], Profile.prototype, "albums", void 0);
__decorate([
    typeorm_1.ManyToOne(type => weight_range_lookup_1.WeightRangeLookup, { eager: true }),
    __metadata("design:type", weight_range_lookup_1.WeightRangeLookup)
], Profile.prototype, "weight", void 0);
__decorate([
    typeorm_1.ManyToOne(type => height_range_lookup_1.HeightRangeLookup, { eager: true }),
    __metadata("design:type", height_range_lookup_1.HeightRangeLookup)
], Profile.prototype, "height", void 0);
__decorate([
    typeorm_1.ManyToOne(type => eye_lookup_1.EyeLookup, { eager: true }),
    __metadata("design:type", eye_lookup_1.EyeLookup)
], Profile.prototype, "eye", void 0);
__decorate([
    typeorm_1.ManyToOne(type => hair_lookup_1.HairLookup, { eager: true }),
    __metadata("design:type", hair_lookup_1.HairLookup)
], Profile.prototype, "hair", void 0);
__decorate([
    typeorm_1.ManyToOne(type => build_lookup_1.BuildLookup, { eager: true }),
    __metadata("design:type", build_lookup_1.BuildLookup)
], Profile.prototype, "build", void 0);
__decorate([
    typeorm_1.ManyToOne(type => ethnicities_lookup_1.EthnicitiesLookup, { eager: true }),
    __metadata("design:type", ethnicities_lookup_1.EthnicitiesLookup)
], Profile.prototype, "ethnicity", void 0);
__decorate([
    typeorm_1.OneToMany(type => activity_attachment_1.ActivityAttachment, ac => ac.profile),
    __metadata("design:type", Array)
], Profile.prototype, "activity_attachment", void 0);
__decorate([
    typeorm_1.OneToMany(type => activity_1.Activity, a => a.profile),
    __metadata("design:type", Array)
], Profile.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToMany(type => activity_1.Activity, ac => ac.activity_likers),
    __metadata("design:type", Array)
], Profile.prototype, "likes", void 0);
__decorate([
    typeorm_1.ManyToMany(type => activity_1.Activity, ac => ac.activity_dislikers),
    __metadata("design:type", Array)
], Profile.prototype, "dislikes", void 0);
__decorate([
    typeorm_1.ManyToMany(type => activity_1.Activity, ac => ac.activity_bookmarks),
    __metadata("design:type", Array)
], Profile.prototype, "bookmarks", void 0);
__decorate([
    typeorm_1.ManyToMany(type => activity_1.Activity, ac => ac.activity_hidden),
    __metadata("design:type", Array)
], Profile.prototype, "hidden", void 0);
__decorate([
    typeorm_1.ManyToMany(type => activity_1.Activity, ac => ac.activityMention),
    __metadata("design:type", Array)
], Profile.prototype, "activity_mentions", void 0);
Profile = __decorate([
    typeorm_1.Entity('users_profile')
], Profile);
exports.Profile = Profile;
//# sourceMappingURL=users_profile.js.map