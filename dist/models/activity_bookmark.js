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
let activity_bookmark = class activity_bookmark {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], activity_bookmark.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], activity_bookmark.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.activity, (activity) => activity.activityBookmarks, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'activity_id' }),
    __metadata("design:type", activity_1.activity)
], activity_bookmark.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.activityBookmarks, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], activity_bookmark.prototype, "authUser", void 0);
activity_bookmark = __decorate([
    typeorm_1.Entity("activity_bookmark", { schema: "public" }),
    typeorm_1.Index("activity_bookmark_activity_id_8cab830c", ["activity",]),
    typeorm_1.Index("activity_bookmark_auth_user_id_68a8ddb2", ["authUser",])
], activity_bookmark);
exports.activity_bookmark = activity_bookmark;
//# sourceMappingURL=activity_bookmark.js.map