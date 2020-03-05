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
const comments_1 = require("./comments");
let comment_mention = class comment_mention {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], comment_mention.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], comment_mention.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.commentMentions, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], comment_mention.prototype, "authUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => comments_1.comments, (comments) => comments.commentMentions, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'comment_id' }),
    __metadata("design:type", comments_1.comments)
], comment_mention.prototype, "comment", void 0);
comment_mention = __decorate([
    typeorm_1.Entity("comment_mention", { schema: "public" }),
    typeorm_1.Index("comment_mention_auth_user_id_35c6200a", ["authUser",]),
    typeorm_1.Index("comment_mention_comment_id_34094d5b", ["comment",])
], comment_mention);
exports.comment_mention = comment_mention;
//# sourceMappingURL=comment_mention.js.map