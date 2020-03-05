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
let django_admin_log = class django_admin_log {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], django_admin_log.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "action_time"
    }),
    __metadata("design:type", Date)
], django_admin_log.prototype, "action_time", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "object_id"
    }),
    __metadata("design:type", String)
], django_admin_log.prototype, "object_id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 200,
        name: "object_repr"
    }),
    __metadata("design:type", String)
], django_admin_log.prototype, "object_repr", void 0);
__decorate([
    typeorm_1.Column("smallint", {
        nullable: false,
        name: "action_flag"
    }),
    __metadata("design:type", Number)
], django_admin_log.prototype, "action_flag", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "change_message"
    }),
    __metadata("design:type", String)
], django_admin_log.prototype, "change_message", void 0);
__decorate([
    typeorm_1.ManyToOne(() => django_content_type_1.django_content_type, (django_content_type) => django_content_type.djangoAdminLogs, {}),
    typeorm_1.JoinColumn({ name: 'content_type_id' }),
    __metadata("design:type", django_content_type_1.django_content_type)
], django_admin_log.prototype, "contentType", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.djangoAdminLogs, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], django_admin_log.prototype, "user", void 0);
django_admin_log = __decorate([
    typeorm_1.Entity("django_admin_log", { schema: "public" }),
    typeorm_1.Index("django_admin_log_content_type_id_c4bce8eb", ["contentType",]),
    typeorm_1.Index("django_admin_log_user_id_c564eba6", ["user",])
], django_admin_log);
exports.django_admin_log = django_admin_log;
//# sourceMappingURL=django_admin_log.js.map