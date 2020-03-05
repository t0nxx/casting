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
const auth_group_1 = require("./auth_group");
const auth_permission_1 = require("./auth_permission");
let auth_group_permissions = class auth_group_permissions {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], auth_group_permissions.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_group_1.auth_group, (auth_group) => auth_group.authGroupPermissionss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'group_id' }),
    __metadata("design:type", auth_group_1.auth_group)
], auth_group_permissions.prototype, "group", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_permission_1.auth_permission, (auth_permission) => auth_permission.authGroupPermissionss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'permission_id' }),
    __metadata("design:type", auth_permission_1.auth_permission)
], auth_group_permissions.prototype, "permission", void 0);
auth_group_permissions = __decorate([
    typeorm_1.Entity("auth_group_permissions", { schema: "public" }),
    typeorm_1.Index("auth_group_permissions_group_id_b120cbf9", ["group",]),
    typeorm_1.Index("auth_group_permissions_group_id_permission_id_0cd325b0_uniq", ["group", "permission",], { unique: true }),
    typeorm_1.Index("auth_group_permissions_permission_id_84c5c92e", ["permission",])
], auth_group_permissions);
exports.auth_group_permissions = auth_group_permissions;
//# sourceMappingURL=auth_group_permissions.js.map