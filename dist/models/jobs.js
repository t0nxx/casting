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
const company_1 = require("./company");
const job_applicants_1 = require("./job_applicants");
const job_category_1 = require("./job_category");
const job_schedules_1 = require("./job_schedules");
const job_shortlisted_1 = require("./job_shortlisted");
let jobs = class jobs {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], jobs.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], jobs.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 250,
        name: "title"
    }),
    __metadata("design:type", String)
], jobs.prototype, "title", void 0);
__decorate([
    typeorm_1.Column("text", {
        nullable: false,
        name: "description"
    }),
    __metadata("design:type", String)
], jobs.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "have_daily_perks"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "have_daily_perks", void 0);
__decorate([
    typeorm_1.Column("numeric", {
        nullable: false,
        precision: 7,
        scale: 2,
        name: "daily_perks_budget"
    }),
    __metadata("design:type", String)
], jobs.prototype, "daily_perks_budget", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "have_transportation"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "have_transportation", void 0);
__decorate([
    typeorm_1.Column("numeric", {
        nullable: false,
        precision: 7,
        scale: 2,
        name: "transportation_budget"
    }),
    __metadata("design:type", String)
], jobs.prototype, "transportation_budget", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "have_meal"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "have_meal", void 0);
__decorate([
    typeorm_1.Column("numeric", {
        nullable: false,
        precision: 7,
        scale: 2,
        name: "meal_budget"
    }),
    __metadata("design:type", String)
], jobs.prototype, "meal_budget", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "have_space_rest"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "have_space_rest", void 0);
__decorate([
    typeorm_1.Column("numeric", {
        nullable: false,
        precision: 7,
        scale: 2,
        name: "space_rest_budget"
    }),
    __metadata("design:type", String)
], jobs.prototype, "space_rest_budget", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_male"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "is_male", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_female"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "is_female", void 0);
__decorate([
    typeorm_1.Column("integer", {
        nullable: true,
        name: "age"
    }),
    __metadata("design:type", Number)
], jobs.prototype, "age", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "hide_company"
    }),
    __metadata("design:type", Boolean)
], jobs.prototype, "hide_company", void 0);
__decorate([
    typeorm_1.Column("numeric", {
        nullable: true,
        precision: 7,
        scale: 2,
        name: "latitude"
    }),
    __metadata("design:type", String)
], jobs.prototype, "latitude", void 0);
__decorate([
    typeorm_1.Column("numeric", {
        nullable: true,
        precision: 7,
        scale: 2,
        name: "longitude"
    }),
    __metadata("design:type", String)
], jobs.prototype, "longitude", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 50,
        name: "slug"
    }),
    __metadata("design:type", String)
], jobs.prototype, "slug", void 0);
__decorate([
    typeorm_1.ManyToOne(() => company_1.company, (company) => company.jobss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'profile_id' }),
    __metadata("design:type", company_1.company)
], jobs.prototype, "profile", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_applicants_1.job_applicants, (job_applicants) => job_applicants.job),
    __metadata("design:type", Array)
], jobs.prototype, "jobApplicantss", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_category_1.job_category, (job_category) => job_category.job),
    __metadata("design:type", Array)
], jobs.prototype, "jobCategorys", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_schedules_1.job_schedules, (job_schedules) => job_schedules.job),
    __metadata("design:type", Array)
], jobs.prototype, "jobScheduless", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_shortlisted_1.job_shortlisted, (job_shortlisted) => job_shortlisted.job),
    __metadata("design:type", Array)
], jobs.prototype, "jobShortlisteds", void 0);
jobs = __decorate([
    typeorm_1.Entity("jobs", { schema: "public" }),
    typeorm_1.Index("jobs_profile_id_0453d121", ["profile",]),
    typeorm_1.Index("jobs_slug_44de2c8b_like", ["slug",]),
    typeorm_1.Index("jobs_slug_key", ["slug",], { unique: true }),
    typeorm_1.Index("jobs_title_key", ["title",], { unique: true }),
    typeorm_1.Index("jobs_title_5ec67837_like", ["title",])
], jobs);
exports.jobs = jobs;
//# sourceMappingURL=jobs.js.map