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
const class_validator_1 = require("class-validator");
const account_emailaddress_1 = require("./account_emailaddress");
const users_profile_1 = require("./users_profile");
let User = class User {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'user name is required' }),
    typeorm_1.Column({ nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'first name is required' }),
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'last name is required' }),
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'email is required' }),
    class_validator_1.IsEmail(),
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'password1 is required' }),
    __metadata("design:type", String)
], User.prototype, "password1", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'password2 is required' }),
    __metadata("design:type", String)
], User.prototype, "password2", void 0);
__decorate([
    typeorm_1.Column('longtext'),
    __metadata("design:type", String)
], User.prototype, "about", void 0);
__decorate([
    typeorm_1.Column({ default: 'noResetPass' }),
    __metadata("design:type", String)
], User.prototype, "resetPassCode", void 0);
__decorate([
    typeorm_1.Column(),
    typeorm_1.Generated('uuid'),
    __metadata("design:type", String)
], User.prototype, "activationCode", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAdmin", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], User.prototype, "social_site", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], User.prototype, "social_site_id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "date_joined", void 0);
__decorate([
    typeorm_1.OneToMany(() => account_emailaddress_1.AccountEmailaddresss, account => account.user, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "accountEmailaddresss", void 0);
__decorate([
    typeorm_1.OneToMany(type => users_profile_1.Profile, profile => profile.user, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], User.prototype, "profiles", void 0);
User = __decorate([
    typeorm_1.Entity('auth_user')
], User);
exports.User = User;
//# sourceMappingURL=auth_user.js.map