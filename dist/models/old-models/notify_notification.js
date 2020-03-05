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
const django_content_type_1 = require("./django_content_type");
const auth_user_1 = require("./auth_user");
let notify_notification = class notify_notification {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], notify_notification.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "actor_object_id"
    }),
    __metadata("design:type", Number)
], notify_notification.prototype, "actor_object_id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "actor_text"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "actor_text", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 200,
        name: "actor_url_text"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "actor_url_text", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 50,
        name: "verb"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "verb", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 255,
        name: "description"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 20,
        name: "nf_type"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "nf_type", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "target_object_id"
    }),
    __metadata("design:type", Number)
], notify_notification.prototype, "target_object_id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "target_text"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "target_text", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 200,
        name: "target_url_text"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "target_url_text", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "obj_object_id"
    }),
    __metadata("design:type", Number)
], notify_notification.prototype, "obj_object_id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 50,
        name: "obj_text"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "obj_text", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 200,
        name: "obj_url_text"
    }),
    __metadata("design:type", String)
], notify_notification.prototype, "obj_url_text", void 0);
__decorate([
    typeorm_1.Column("jsonb", {
        nullable: true,
        name: "extra"
    }),
    __metadata("design:type", Object)
], notify_notification.prototype, "extra", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], notify_notification.prototype, "created", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "read"
    }),
    __metadata("design:type", Boolean)
], notify_notification.prototype, "read", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "deleted"
    }),
    __metadata("design:type", Boolean)
], notify_notification.prototype, "deleted", void 0);
__decorate([
    typeorm_1.ManyToOne(() => django_content_type_1.django_content_type, (django_content_type) => django_content_type.notifyNotifications, {}),
    typeorm_1.JoinColumn({ name: 'actor_content_type_id' }),
    __metadata("design:type", django_content_type_1.django_content_type)
], notify_notification.prototype, "actorContentType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => django_content_type_1.django_content_type, (django_content_type) => django_content_type.notifyNotifications2, {}),
    typeorm_1.JoinColumn({ name: 'obj_content_type_id' }),
    __metadata("design:type", django_content_type_1.django_content_type)
], notify_notification.prototype, "objContentType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.notifyNotifications, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'recipient_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], notify_notification.prototype, "recipient", void 0);
__decorate([
    typeorm_1.ManyToOne(() => django_content_type_1.django_content_type, (django_content_type) => django_content_type.notifyNotifications3, {}),
    typeorm_1.JoinColumn({ name: 'target_content_type_id' }),
    __metadata("design:type", django_content_type_1.django_content_type)
], notify_notification.prototype, "targetContentType", void 0);
notify_notification = __decorate([
    typeorm_1.Entity("notify_notification", { schema: "public" }),
    typeorm_1.Index("notify_notification_actor_content_type_id_1a428036", ["actorContentType",]),
    typeorm_1.Index("notify_notification_obj_content_type_id_93f677d5", ["objContentType",]),
    typeorm_1.Index("notify_notification_recipient_id_07222ca5", ["recipient",]),
    typeorm_1.Index("notify_notification_target_content_type_id_55b5712a", ["targetContentType",])
], notify_notification);
exports.notify_notification = notify_notification;
//# sourceMappingURL=notify_notification.js.map