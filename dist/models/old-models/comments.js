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
var comments_1;
const typeorm_1 = require("typeorm");
const activity_1 = require("./activity");
const auth_user_1 = require("./auth_user");
const comment_mention_1 = require("./comment_mention");
let comments = comments_1 = class comments {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], comments.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "comment"
    }),
    __metadata("design:type", String)
], comments.prototype, "comment", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], comments.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.activity, (activity) => activity.commentss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'activity_id' }),
    __metadata("design:type", activity_1.activity)
], comments.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.commentss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], comments.prototype, "authUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => comments_1, (comments) => comments.commentss, {}),
    typeorm_1.JoinColumn({ name: 'thread_id' }),
    __metadata("design:type", comments)
], comments.prototype, "thread", void 0);
__decorate([
    typeorm_1.OneToMany(() => comment_mention_1.comment_mention, (comment_mention) => comment_mention.comment),
    __metadata("design:type", Array)
], comments.prototype, "commentMentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => comments_1, (comments) => comments.thread),
    __metadata("design:type", Array)
], comments.prototype, "commentss", void 0);
comments = comments_1 = __decorate([
    typeorm_1.Entity("comments", { schema: "public" }),
    typeorm_1.Index("comments_activity_id_bc3e877f", ["activity",]),
    typeorm_1.Index("comments_auth_user_id_e9f0858b", ["authUser",]),
    typeorm_1.Index("comments_thread_id_8f492724", ["thread",])
], comments);
exports.comments = comments;
//# sourceMappingURL=comments.js.map