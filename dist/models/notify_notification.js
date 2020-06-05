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
let Notification = class Notification {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Notification.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: '' }),
    __metadata("design:type", String)
], Notification.prototype, "verb", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Notification.prototype, "type", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Notification.prototype, "target_job_slug", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Notification.prototype, "target_profile_slug", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Notification.prototype, "target_company", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", Number)
], Notification.prototype, "target_activity_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Notification.prototype, "created", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "read", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Notification.prototype, "actor_first_name", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Notification.prototype, "actor_last_name", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Notification.prototype, "actor_avatar", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.notifications, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], Notification.prototype, "recipient", void 0);
Notification = __decorate([
    typeorm_1.Entity('notification')
], Notification);
exports.Notification = Notification;
//# sourceMappingURL=notify_notification.js.map