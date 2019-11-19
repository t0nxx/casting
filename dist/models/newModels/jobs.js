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
const talent_categories_1 = require("./talent_categories");
let Jobs = class Jobs {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Jobs.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], Jobs.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Jobs.prototype, "title", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Jobs.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "have_daily_perks", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Jobs.prototype, "daily_perks_budget", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "have_transportation", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Jobs.prototype, "transportation_budget", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "have_meal", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Jobs.prototype, "meal_budget", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "have_space_rest", void 0);
__decorate([
    typeorm_1.Column({ default: 0 }),
    __metadata("design:type", Number)
], Jobs.prototype, "space_rest_budget", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "is_male", void 0);
__decorate([
    typeorm_1.Column({ default: true }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "is_female", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Jobs.prototype, "age", void 0);
__decorate([
    typeorm_1.Column({ default: false }),
    __metadata("design:type", Boolean)
], Jobs.prototype, "hide_company", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Jobs.prototype, "latitude", void 0);
__decorate([
    typeorm_1.Column({ default: null }),
    __metadata("design:type", String)
], Jobs.prototype, "longitude", void 0);
__decorate([
    typeorm_1.Column({ unique: true }),
    __metadata("design:type", String)
], Jobs.prototype, "slug", void 0);
__decorate([
    typeorm_1.ManyToOne(type => company_1.Company, { eager: true }),
    __metadata("design:type", company_1.Company)
], Jobs.prototype, "company", void 0);
__decorate([
    typeorm_1.ManyToMany(type => talent_categories_1.TalentCategories, { onDelete: 'CASCADE' }),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Jobs.prototype, "category", void 0);
Jobs = __decorate([
    typeorm_1.Entity('jobs')
], Jobs);
exports.Jobs = Jobs;
//# sourceMappingURL=jobs.js.map