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
const auth_user_1 = require("./auth_user");
let activity_social_actions = class activity_social_actions {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], activity_social_actions.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], activity_social_actions.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "has_like"
    }),
    __metadata("design:type", Boolean)
], activity_social_actions.prototype, "has_like", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "has_dislike"
    }),
    __metadata("design:type", Boolean)
], activity_social_actions.prototype, "has_dislike", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "has_share"
    }),
    __metadata("design:type", Boolean)
], activity_social_actions.prototype, "has_share", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.activity, (activity) => activity.activitySocialActionss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'activity_id' }),
    __metadata("design:type", activity_1.activity)
], activity_social_actions.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.activitySocialActionss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], activity_social_actions.prototype, "authUser", void 0);
activity_social_actions = __decorate([
    typeorm_1.Entity("activity_social_actions", { schema: "public" }),
    typeorm_1.Index("activity_social_actions_activity_id_7cae677a", ["activity",]),
    typeorm_1.Index("activity_social_actions_auth_user_id_9430483a", ["authUser",]),
    typeorm_1.Index("activity_social_actions_has_dislike_eef4969f", ["has_dislike",]),
    typeorm_1.Index("activity_social_actions_has_like_464c110b", ["has_like",]),
    typeorm_1.Index("activity_social_actions_has_share_2006f986", ["has_share",])
], activity_social_actions);
exports.activity_social_actions = activity_social_actions;
//# sourceMappingURL=activity_social_actions.js.map