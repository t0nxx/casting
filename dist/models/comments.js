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
var Comment_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const activity_1 = require("./activity");
const users_profile_1 = require("./users_profile");
let Comment = Comment_1 = class Comment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Comment.prototype, "comment", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Comment.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.ManyToOne(type => activity_1.Activity, a => a.activity_Comments, { onDelete: 'CASCADE' }),
    __metadata("design:type", activity_1.Activity)
], Comment.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.activity_Comments, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], Comment.prototype, "profile", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, p => p.comment_mentions),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Comment.prototype, "commentMention", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Comment_1, c => c.thread, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Comment)
], Comment.prototype, "thread", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "comments_count", void 0);
Comment = Comment_1 = __decorate([
    typeorm_1.Entity('comments')
], Comment);
exports.Comment = Comment;
//# sourceMappingURL=comments.js.map