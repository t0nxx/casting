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
const account_emailaddress_1 = require("./account_emailaddress");
const activity_1 = require("./activity");
const activity_attachment_1 = require("./activity_attachment");
const activity_bookmark_1 = require("./activity_bookmark");
const activity_control_1 = require("./activity_control");
const activity_ignore_1 = require("./activity_ignore");
const activity_mention_1 = require("./activity_mention");
const activity_report_1 = require("./activity_report");
const activity_social_actions_1 = require("./activity_social_actions");
const auth_user_groups_1 = require("./auth_user_groups");
const auth_user_user_permissions_1 = require("./auth_user_user_permissions");
const authtoken_token_1 = require("./authtoken_token");
const comment_mention_1 = require("./comment_mention");
const comments_1 = require("./comments");
const django_admin_log_1 = require("./django_admin_log");
const friendship_block_1 = require("./friendship_block");
const friendship_follow_1 = require("./friendship_follow");
const friendship_friend_1 = require("./friendship_friend");
const friendship_friendshiprequest_1 = require("./friendship_friendshiprequest");
const notify_notification_1 = require("./notify_notification");
const socialaccount_socialaccount_1 = require("./socialaccount_socialaccount");
const users_profile_1 = require("./users_profile");
let auth_user = class auth_user {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], auth_user.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 128,
        name: "password"
    }),
    __metadata("design:type", String)
], auth_user.prototype, "password", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "last_login"
    }),
    __metadata("design:type", Date)
], auth_user.prototype, "last_login", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_superuser"
    }),
    __metadata("design:type", Boolean)
], auth_user.prototype, "is_superuser", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 150,
        name: "username"
    }),
    __metadata("design:type", String)
], auth_user.prototype, "username", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 30,
        name: "first_name"
    }),
    __metadata("design:type", String)
], auth_user.prototype, "first_name", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 150,
        name: "last_name"
    }),
    __metadata("design:type", String)
], auth_user.prototype, "last_name", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 254,
        name: "email"
    }),
    __metadata("design:type", String)
], auth_user.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_staff"
    }),
    __metadata("design:type", Boolean)
], auth_user.prototype, "is_staff", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_active"
    }),
    __metadata("design:type", Boolean)
], auth_user.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "date_joined"
    }),
    __metadata("design:type", Date)
], auth_user.prototype, "date_joined", void 0);
__decorate([
    typeorm_1.OneToMany(() => account_emailaddress_1.account_emailaddress, (account_emailaddress) => account_emailaddress.user),
    __metadata("design:type", Array)
], auth_user.prototype, "accountEmailaddresss", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_1.activity, (activity) => activity.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activitys", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_attachment_1.activity_attachment, (activity_attachment) => activity_attachment.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activityAttachments", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_bookmark_1.activity_bookmark, (activity_bookmark) => activity_bookmark.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activityBookmarks", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_control_1.activity_control, (activity_control) => activity_control.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activityControls", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_ignore_1.activity_ignore, (activity_ignore) => activity_ignore.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activityIgnores", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_mention_1.activity_mention, (activity_mention) => activity_mention.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activityMentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_report_1.activity_report, (activity_report) => activity_report.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activityReports", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_social_actions_1.activity_social_actions, (activity_social_actions) => activity_social_actions.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "activitySocialActionss", void 0);
__decorate([
    typeorm_1.OneToMany(() => auth_user_groups_1.auth_user_groups, (auth_user_groups) => auth_user_groups.user),
    __metadata("design:type", Array)
], auth_user.prototype, "authUserGroupss", void 0);
__decorate([
    typeorm_1.OneToMany(() => auth_user_user_permissions_1.auth_user_user_permissions, (auth_user_user_permissions) => auth_user_user_permissions.user),
    __metadata("design:type", Array)
], auth_user.prototype, "authUserUserPermissionss", void 0);
__decorate([
    typeorm_1.OneToOne(() => authtoken_token_1.authtoken_token, (authtoken_token) => authtoken_token.user),
    __metadata("design:type", authtoken_token_1.authtoken_token)
], auth_user.prototype, "authtokenToken", void 0);
__decorate([
    typeorm_1.OneToMany(() => comment_mention_1.comment_mention, (comment_mention) => comment_mention.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "commentMentions", void 0);
__decorate([
    typeorm_1.OneToMany(() => comments_1.comments, (comments) => comments.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "commentss", void 0);
__decorate([
    typeorm_1.OneToMany(() => django_admin_log_1.django_admin_log, (django_admin_log) => django_admin_log.user),
    __metadata("design:type", Array)
], auth_user.prototype, "djangoAdminLogs", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_block_1.friendship_block, (friendship_block) => friendship_block.blocked),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipBlocks", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_block_1.friendship_block, (friendship_block) => friendship_block.blocker),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipBlocks2", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_follow_1.friendship_follow, (friendship_follow) => friendship_follow.followee),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipFollows", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_follow_1.friendship_follow, (friendship_follow) => friendship_follow.follower),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipFollows2", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_friend_1.friendship_friend, (friendship_friend) => friendship_friend.fromUser),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipFriends", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_friend_1.friendship_friend, (friendship_friend) => friendship_friend.toUser),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipFriends2", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_friendshiprequest_1.friendship_friendshiprequest, (friendship_friendshiprequest) => friendship_friendshiprequest.fromUser),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipFriendshiprequests", void 0);
__decorate([
    typeorm_1.OneToMany(() => friendship_friendshiprequest_1.friendship_friendshiprequest, (friendship_friendshiprequest) => friendship_friendshiprequest.toUser),
    __metadata("design:type", Array)
], auth_user.prototype, "friendshipFriendshiprequests2", void 0);
__decorate([
    typeorm_1.OneToMany(() => notify_notification_1.notify_notification, (notify_notification) => notify_notification.recipient),
    __metadata("design:type", Array)
], auth_user.prototype, "notifyNotifications", void 0);
__decorate([
    typeorm_1.OneToMany(() => socialaccount_socialaccount_1.socialaccount_socialaccount, (socialaccount_socialaccount) => socialaccount_socialaccount.user),
    __metadata("design:type", Array)
], auth_user.prototype, "socialaccountSocialaccounts", void 0);
__decorate([
    typeorm_1.OneToMany(() => users_profile_1.users_profile, (users_profile) => users_profile.authUser),
    __metadata("design:type", Array)
], auth_user.prototype, "usersProfiles", void 0);
auth_user = __decorate([
    typeorm_1.Entity("auth_user", { schema: "public" }),
    typeorm_1.Index("auth_user_username_6821ab7c_like", ["username",]),
    typeorm_1.Index("auth_user_username_key", ["username",], { unique: true })
], auth_user);
exports.auth_user = auth_user;
//# sourceMappingURL=auth_user.js.map