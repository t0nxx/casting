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
var activity_1;
const typeorm_1 = require("typeorm");
const auth_user_1 = require("./auth_user");
const company_1 = require("./company");
const activity_attachment_1 = require("./activity_attachment");
const activity_bookmark_1 = require("./activity_bookmark");
const activity_control_1 = require("./activity_control");
const activity_ignore_1 = require("./activity_ignore");
const activity_mention_1 = require("./activity_mention");
const activity_report_1 = require("./activity_report");
const activity_social_actions_1 = require("./activity_social_actions");
const comments_1 = require("./comments");
let activity = activity_1 = class activity {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], activity.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "content"
    }),
    __metadata("design:type", String)
], activity.prototype, "content", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], activity.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_blocked"
    }),
    __metadata("design:type", Boolean)
], activity.prototype, "is_blocked", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 150,
        name: "action"
    }),
    __metadata("design:type", String)
], activity.prototype, "action", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_active"
    }),
    __metadata("design:type", Boolean)
], activity.prototype, "is_active", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.activitys, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], activity.prototype, "authUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => company_1.company, (company) => company.activitys, {}),
    typeorm_1.JoinColumn({ name: 'company_id' }),
    __metadata("design:type", company_1.company)
], activity.prototype, "company", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1, (activity) => activity.activitys, {}),
    typeorm_1.JoinColumn({ name: 'original_activity' }),
    __metadata("design:type", activity)
], activity.prototype, "originalActivity", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_1, (activity) => activity.originalActivity),
    __metadata("design:type", Array)
], activity.prototype, "activitys", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_attachment_1.activity_attachment, (activity_attachment) => activity_attachment.activity),
    __metadata("design:type", Array)
], activity.prototype, "activityAttachments", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_bookmark_1.activity_bookmark, (activity_bookmark) => activity_bookmark.activity),
    __metadata("design:type", Array)
], activity.prototype, "activityBookmarks", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_control_1.activity_control, (activity_control) => activity_control.activity),
    __metadata("design:type", Array)
], activity.prototype, "activityControls", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_ignore_1.activity_ignore, (activity_ignore) => activity_ignore.activity),
    __metadata("design:type", Array)
], activity.prototype, "activityIgnores", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_mention_1.activity_mention, (activity_mention) => activity_mention.activity),
    __metadata("design:type", Array)
], activity.prototype, "activityMentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_report_1.activity_report, (activity_report) => activity_report.activity),
    __metadata("design:type", Array)
], activity.prototype, "activityReports", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_social_actions_1.activity_social_actions, (activity_social_actions) => activity_social_actions.activity),
    __metadata("design:type", Array)
], activity.prototype, "activitySocialActionss", void 0);
__decorate([
    typeorm_1.OneToMany(() => comments_1.comments, (comments) => comments.activity),
    __metadata("design:type", Array)
], activity.prototype, "commentss", void 0);
activity = activity_1 = __decorate([
    typeorm_1.Entity("activity", { schema: "public" }),
    typeorm_1.Index("activity_auth_user_id_faff7f0e", ["authUser",]),
    typeorm_1.Index("activity_company_id_484a766d", ["company",]),
    typeorm_1.Index("activity_original_activity_974d22b8", ["originalActivity",])
], activity);
exports.activity = activity;
//# sourceMappingURL=activity.js.map