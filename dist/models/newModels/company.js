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
const talent_categories_1 = require("./talent_categories");
const activity_1 = require("./activity");
let Company = class Company {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Company.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: 'https://casting-secret.s3.eu-central-1.amazonaws.com/company-avatar.png' }),
    __metadata("design:type", String)
], Company.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column({ default: 'https://casting-secret.s3.eu-central-1.amazonaws.com/banner.jpg' }),
    __metadata("design:type", String)
], Company.prototype, "cover", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Company.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 'no data provided' }),
    __metadata("design:type", String)
], Company.prototype, "about", void 0);
__decorate([
    typeorm_1.Column({ default: 'no data provided' }),
    __metadata("design:type", String)
], Company.prototype, "headquarter", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Company.prototype, "is_address_public", void 0);
__decorate([
    typeorm_1.Column({ default: 'castingsecret.com' }),
    __metadata("design:type", String)
], Company.prototype, "website", void 0);
__decorate([
    typeorm_1.Column({ default: '2000' }),
    __metadata("design:type", String)
], Company.prototype, "since", void 0);
__decorate([
    typeorm_1.Column({ default: 1 }),
    __metadata("design:type", Number)
], Company.prototype, "size_from", void 0);
__decorate([
    typeorm_1.Column({ default: 100 }),
    __metadata("design:type", Number)
], Company.prototype, "size_to", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Company.prototype, "slug", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.companies, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], Company.prototype, "profile", void 0);
__decorate([
    typeorm_1.ManyToMany(type => talent_categories_1.TalentCategories, { onDelete: 'CASCADE' }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Company.prototype, "tags", void 0);
__decorate([
    typeorm_1.ManyToMany(type => users_profile_1.Profile, { onDelete: 'CASCADE' }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Company.prototype, "followers", void 0);
__decorate([
    typeorm_1.OneToMany(type => activity_1.Activity, a => a.company),
    __metadata("design:type", Array)
], Company.prototype, "activity", void 0);
Company = __decorate([
    typeorm_1.Entity('company')
], Company);
exports.Company = Company;
//# sourceMappingURL=company.js.map