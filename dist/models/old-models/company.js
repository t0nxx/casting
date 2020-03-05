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
const activity_1 = require("./activity");
const company_tags_1 = require("./company_tags");
const jobs_1 = require("./jobs");
let company = class company {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], company.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 150,
        name: "avatar"
    }),
    __metadata("design:type", String)
], company.prototype, "avatar", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 150,
        name: "cover"
    }),
    __metadata("design:type", String)
], company.prototype, "cover", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 150,
        name: "name"
    }),
    __metadata("design:type", String)
], company.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "about"
    }),
    __metadata("design:type", String)
], company.prototype, "about", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "headquarter"
    }),
    __metadata("design:type", String)
], company.prototype, "headquarter", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_address_public"
    }),
    __metadata("design:type", Boolean)
], company.prototype, "is_address_public", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        length: 200,
        name: "website"
    }),
    __metadata("design:type", String)
], company.prototype, "website", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: true,
        name: "since"
    }),
    __metadata("design:type", String)
], company.prototype, "since", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "size_from"
    }),
    __metadata("design:type", Number)
], company.prototype, "size_from", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "size_to"
    }),
    __metadata("design:type", Number)
], company.prototype, "size_to", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 50,
        name: "slug"
    }),
    __metadata("design:type", String)
], company.prototype, "slug", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.companys, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], company.prototype, "profile", void 0);
__decorate([
    typeorm_1.OneToMany(() => activity_1.activity, (activity) => activity.company),
    __metadata("design:type", Array)
], company.prototype, "activitys", void 0);
__decorate([
    typeorm_1.OneToMany(() => company_tags_1.company_tags, (company_tags) => company_tags.company),
    __metadata("design:type", Array)
], company.prototype, "companyTagss", void 0);
__decorate([
    typeorm_1.OneToMany(() => jobs_1.jobs, (jobs) => jobs.profile),
    __metadata("design:type", Array)
], company.prototype, "jobss", void 0);
company = __decorate([
    typeorm_1.Entity("company", { schema: "public" }),
    typeorm_1.Index("company_profile_id_8cfef0e4", ["profile",]),
    typeorm_1.Index("company_slug_b6928c11_like", ["slug",]),
    typeorm_1.Index("company_slug_b6928c11", ["slug",])
], company);
exports.company = company;
//# sourceMappingURL=company.js.map