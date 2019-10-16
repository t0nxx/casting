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
const jobs_1 = require("./jobs");
const talent_categories_1 = require("./talent_categories");
let job_category = class job_category {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], job_category.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => jobs_1.jobs, (jobs) => jobs.jobCategorys, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'job_id' }),
    __metadata("design:type", jobs_1.jobs)
], job_category.prototype, "job", void 0);
__decorate([
    typeorm_1.ManyToOne(() => talent_categories_1.talent_categories, (talent_categories) => talent_categories.jobCategorys, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'job_category_id' }),
    __metadata("design:type", talent_categories_1.talent_categories)
], job_category.prototype, "jobCategory", void 0);
job_category = __decorate([
    typeorm_1.Entity("job_category", { schema: "public" }),
    typeorm_1.Index("job_category_job_category_id_2c9511f0", ["jobCategory",]),
    typeorm_1.Index("job_category_job_id_09117672", ["job",])
], job_category);
exports.job_category = job_category;
//# sourceMappingURL=job_category.js.map