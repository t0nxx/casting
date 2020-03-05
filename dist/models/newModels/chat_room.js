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
const chat_1 = require("./chat");
let ChatRoom = class ChatRoom {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ChatRoom.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ChatRoom.prototype, "name", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], ChatRoom.prototype, "created", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], ChatRoom.prototype, "last_deleted_from_participant1", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Date)
], ChatRoom.prototype, "last_deleted_from_participant2", void 0);
__decorate([
    typeorm_1.Column('simple-array', { nullable: true }),
    __metadata("design:type", Array)
], ChatRoom.prototype, "muted_from", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], ChatRoom.prototype, "participant1", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], ChatRoom.prototype, "participant2", void 0);
__decorate([
    typeorm_1.OneToMany(type => chat_1.Chat, ch => ch.room),
    __metadata("design:type", Array)
], ChatRoom.prototype, "messages", void 0);
ChatRoom = __decorate([
    typeorm_1.Entity('chat_room')
], ChatRoom);
exports.ChatRoom = ChatRoom;
//# sourceMappingURL=chat_room.js.map