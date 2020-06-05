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
let AccountEmailaddresss = class AccountEmailaddresss {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], AccountEmailaddresss.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], AccountEmailaddresss.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], AccountEmailaddresss.prototype, "verified", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], AccountEmailaddresss.prototype, "primary", void 0);
__decorate([
    typeorm_1.Column({ default: 'noKey' }),
    __metadata("design:type", String)
], AccountEmailaddresss.prototype, "ConfirmKey", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.User, user => user.accountEmailaddresss),
    __metadata("design:type", auth_user_1.User)
], AccountEmailaddresss.prototype, "user", void 0);
AccountEmailaddresss = __decorate([
    typeorm_1.Entity('account_emailaddress')
], AccountEmailaddresss);
exports.AccountEmailaddresss = AccountEmailaddresss;
//# sourceMappingURL=account_emailaddress.js.map