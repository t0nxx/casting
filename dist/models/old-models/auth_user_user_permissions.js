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
const auth_permission_1 = require("./auth_permission");
let auth_user_user_permissions = class auth_user_user_permissions {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], auth_user_user_permissions.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.authUserUserPermissionss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], auth_user_user_permissions.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_permission_1.auth_permission, (auth_permission) => auth_permission.authUserUserPermissionss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'permission_id' }),
    __metadata("design:type", auth_permission_1.auth_permission)
], auth_user_user_permissions.prototype, "permission", void 0);
auth_user_user_permissions = __decorate([
    typeorm_1.Entity("auth_user_user_permissions", { schema: "public" }),
    typeorm_1.Index("auth_user_user_permissions_permission_id_1fbb5f2c", ["permission",]),
    typeorm_1.Index("auth_user_user_permissions_user_id_permission_id_14a6b632_uniq", ["permission", "user",], { unique: true }),
    typeorm_1.Index("auth_user_user_permissions_user_id_a95ead1b", ["user",])
], auth_user_user_permissions);
exports.auth_user_user_permissions = auth_user_user_permissions;
//# sourceMappingURL=auth_user_user_permissions.js.map