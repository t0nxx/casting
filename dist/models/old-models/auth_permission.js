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
const auth_group_permissions_1 = require("./auth_group_permissions");
const auth_user_user_permissions_1 = require("./auth_user_user_permissions");
let auth_permission = class auth_permission {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], auth_permission.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 255,
        name: "name"
    }),
    __metadata("design:type", String)
], auth_permission.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(() => django_content_type_1.django_content_type, (django_content_type) => django_content_type.authPermissions, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'content_type_id' }),
    __metadata("design:type", django_content_type_1.django_content_type)
], auth_permission.prototype, "contentType", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 100,
        name: "codename"
    }),
    __metadata("design:type", String)
], auth_permission.prototype, "codename", void 0);
__decorate([
    typeorm_1.OneToMany(() => auth_group_permissions_1.auth_group_permissions, (auth_group_permissions) => auth_group_permissions.permission),
    __metadata("design:type", Array)
], auth_permission.prototype, "authGroupPermissionss", void 0);
__decorate([
    typeorm_1.OneToMany(() => auth_user_user_permissions_1.auth_user_user_permissions, (auth_user_user_permissions) => auth_user_user_permissions.permission),
    __metadata("design:type", Array)
], auth_permission.prototype, "authUserUserPermissionss", void 0);
auth_permission = __decorate([
    typeorm_1.Entity("auth_permission", { schema: "public" }),
    typeorm_1.Index("auth_permission_content_type_id_codename_01ab375a_uniq", ["codename", "contentType",], { unique: true }),
    typeorm_1.Index("auth_permission_content_type_id_2f476e4b", ["contentType",])
], auth_permission);
exports.auth_permission = auth_permission;
//# sourceMappingURL=auth_permission.js.map