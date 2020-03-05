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
let friendship_block = class friendship_block {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], friendship_block.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], friendship_block.prototype, "created", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipBlocks, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'blocked_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_block.prototype, "blocked", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.friendshipBlocks2, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'blocker_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], friendship_block.prototype, "blocker", void 0);
friendship_block = __decorate([
    typeorm_1.Entity("friendship_block", { schema: "public" }),
    typeorm_1.Index("friendship_block_blocked_id_75e16cd7", ["blocked",]),
    typeorm_1.Index("friendship_block_blocker_id_blocked_id_e24c5fca_uniq", ["blocked", "blocker",], { unique: true }),
    typeorm_1.Index("friendship_block_blocker_id_94707a64", ["blocker",])
], friendship_block);
exports.friendship_block = friendship_block;
//# sourceMappingURL=friendship_block.js.map