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
let friendship_follow = class friendship_follow {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], friendship_follow.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], friendship_follow.prototype, "created", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipFollows, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'followee_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_follow.prototype, "followee", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipFollows2, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'follower_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_follow.prototype, "follower", void 0);
friendship_follow = __decorate([
    typeorm_1.Entity("friendship_follow", { schema: "public" }),
    typeorm_1.Index("friendship_follow_followee_id_3348979c", ["followee",]),
    typeorm_1.Index("friendship_follow_follower_id_followee_id_75264015_uniq", ["followee", "follower",], { unique: true }),
    typeorm_1.Index("friendship_follow_follower_id_c10685be", ["follower",])
], friendship_follow);
exports.friendship_follow = friendship_follow;
//# sourceMappingURL=friendship_follow.js.map