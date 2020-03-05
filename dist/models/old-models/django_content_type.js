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
const auth_permission_1 = require("./auth_permission");
const django_admin_log_1 = require("./django_admin_log");
const notify_notification_1 = require("./notify_notification");
let django_content_type = class django_content_type {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], django_content_type.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 100,
        name: "app_label"
    }),
    __metadata("design:type", String)
], django_content_type.prototype, "app_label", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 100,
        name: "model"
    }),
    __metadata("design:type", String)
], django_content_type.prototype, "model", void 0);
__decorate([
    typeorm_1.OneToMany(() => auth_permission_1.auth_permission, (auth_permission) => auth_permission.contentType),
    __metadata("design:type", Array)
], django_content_type.prototype, "authPermissions", void 0);
__decorate([
    typeorm_1.OneToMany(() => django_admin_log_1.django_admin_log, (django_admin_log) => django_admin_log.contentType),
    __metadata("design:type", Array)
], django_content_type.prototype, "djangoAdminLogs", void 0);
__decorate([
    typeorm_1.OneToMany(() => notify_notification_1.notify_notification, (notify_notification) => notify_notification.actorContentType),
    __metadata("design:type", Array)
], django_content_type.prototype, "notifyNotifications", void 0);
__decorate([
    typeorm_1.OneToMany(() => notify_notification_1.notify_notification, (notify_notification) => notify_notification.objContentType),
    __metadata("design:type", Array)
], django_content_type.prototype, "notifyNotifications2", void 0);
__decorate([
    typeorm_1.OneToMany(() => notify_notification_1.notify_notification, (notify_notification) => notify_notification.targetContentType),
    __metadata("design:type", Array)
], django_content_type.prototype, "notifyNotifications3", void 0);
django_content_type = __decorate([
    typeorm_1.Entity("django_content_type", { schema: "public" }),
    typeorm_1.Index("django_content_type_app_label_model_76bd3d3b_uniq", ["app_label", "model",], { unique: true })
], django_content_type);
exports.django_content_type = django_content_type;
//# sourceMappingURL=django_content_type.js.map