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
const users_profile_1 = require("./users_profile");
let FriendshipFriend = class FriendshipFriend {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], FriendshipFriend.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], FriendshipFriend.prototype, "created", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], FriendshipFriend.prototype, "fromUser", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], FriendshipFriend.prototype, "toUser", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], FriendshipFriend.prototype, "room", void 0);
FriendshipFriend = __decorate([
    typeorm_1.Entity('friendship_friend')
], FriendshipFriend);
exports.FriendshipFriend = FriendshipFriend;
//# sourceMappingURL=friendship_friend.js.map