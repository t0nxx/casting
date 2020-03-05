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
let friendship_friendshiprequest = class friendship_friendshiprequest {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], friendship_friendshiprequest.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "message"
    }),
    __metadata("design:type", String)
], friendship_friendshiprequest.prototype, "message", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], friendship_friendshiprequest.prototype, "created", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "rejected"
    }),
    __metadata("design:type", Date)
], friendship_friendshiprequest.prototype, "rejected", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "viewed"
    }),
    __metadata("design:type", Date)
], friendship_friendshiprequest.prototype, "viewed", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipFriendshiprequests, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'from_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_friendshiprequest.prototype, "fromUser", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipFriendshiprequests2, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'to_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_friendshiprequest.prototype, "toUser", void 0);
friendship_friendshiprequest = __decorate([
    typeorm_1.Entity("friendship_friendshiprequest", { schema: "public" }),
    typeorm_1.Index("friendship_friendshiprequest_from_user_id_bbaf16e8", ["fromUser",]),
    typeorm_1.Index("friendship_friendshipreq_from_user_id_to_user_id_003053a1_uniq", ["fromUser", "toUser",], { unique: true }),
    typeorm_1.Index("friendship_friendshiprequest_to_user_id_51d5a5a2", ["toUser",])
], friendship_friendshiprequest);
exports.friendship_friendshiprequest = friendship_friendshiprequest;
//# sourceMappingURL=friendship_friendshiprequest.js.map