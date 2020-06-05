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
const company_1 = require("./company");
const activity_attachment_1 = require("./activity_attachment");
const users_profile_1 = require("./users_profile");
const comments_1 = require("./comments");
const activity_reports_1 = require("./activity_reports");
let Activity = class Activity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Activity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column('longtext'),
    __metadata("design:type", String)
], Activity.prototype, "content", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Activity.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], Activity.prototype, "uploadingComment", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "comments_count", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "share_count", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "like_count", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "dislike_count", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Activity.prototype, "resports_count", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.activity, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], Activity.prototype, "profile", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_1.Company, c => c.activity, { onDelete: 'CASCADE' }),
    __metadata("design:type", company_1.Company)
], Activity.prototype, "company", void 0);
__decorate([
    typeorm_1.OneToMany(type => activity_attachment_1.ActivityAttachment, ac => ac.activity),
    __metadata("design:type", Array)
], Activity.prototype, "activity_attachment", void 0);
__decorate([
    typeorm_1.OneToMany(type => comments_1.Comment, ac => ac.activity),
    __metadata("design:type", Array)
], Activity.prototype, "activity_Comments", void 0);
__decorate([
    typeorm_1.OneToMany(type => activity_reports_1.ActivityReports, ac => ac.activity),
    __metadata("design:type", Array)
], Activity.prototype, "reports", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, p => p.likes),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Activity.prototype, "activity_likers", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, p => p.dislikes),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Activity.prototype, "activity_dislikers", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, p => p.bookmarks),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Activity.prototype, "activity_bookmarks", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, p => p.hidden),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Activity.prototype, "activity_hidden", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, p => p.activity_mentions),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Activity.prototype, "activityMention", void 0);
Activity = __decorate([
    typeorm_1.Entity('activity')
], Activity);
exports.Activity = Activity;
//# sourceMappingURL=activity.js.map