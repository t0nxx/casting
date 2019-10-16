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
let friendship_friend = class friendship_friend {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], friendship_friend.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], friendship_friend.prototype, "created", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipFriends, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'from_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_friend.prototype, "fromUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipFriends2, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'to_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_friend.prototype, "toUser", void 0);
friendship_friend = __decorate([
    typeorm_1.Entity("friendship_friend", { schema: "public" }),
    typeorm_1.Index("friendship_friend_from_user_id_f229f783", ["fromUser",]),
    typeorm_1.Index("friendship_friend_from_user_id_to_user_id_5aa078c0_uniq", ["fromUser", "toUser",], { unique: true }),
    typeorm_1.Index("friendship_friend_to_user_id_0de15f5e", ["toUser",])
], friendship_friend);
exports.friendship_friend = friendship_friend;
//# sourceMappingURL=friendship_friend.js.map