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
const auth_group_1 = require("./auth_group");
let auth_user_groups = class auth_user_groups {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], auth_user_groups.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.authUserGroupss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], auth_user_groups.prototype, "user", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_group_1.auth_group, (auth_group) => auth_group.authUserGroupss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'group_id' }),
    __metadata("design:type", auth_group_1.auth_group)
], auth_user_groups.prototype, "group", void 0);
auth_user_groups = __decorate([
    typeorm_1.Entity("auth_user_groups", { schema: "public" }),
    typeorm_1.Index("auth_user_groups_group_id_97559544", ["group",]),
    typeorm_1.Index("auth_user_groups_user_id_group_id_94350c0c_uniq", ["group", "user",], { unique: true }),
    typeorm_1.Index("auth_user_groups_user_id_6a12ed8b", ["user",])
], auth_user_groups);
exports.auth_user_groups = auth_user_groups;
//# sourceMappingURL=auth_user_groups.js.map