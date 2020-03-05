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
const company_tags_1 = require("./company_tags");
const job_category_1 = require("./job_category");
const users_profile_categories_1 = require("./users_profile_categories");
let talent_categories = class talent_categories {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], talent_categories.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 150,
        name: "name_en"
    }),
    __metadata("design:type", String)
], talent_categories.prototype, "name_en", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 150,
        name: "name_ar"
    }),
    __metadata("design:type", String)
], talent_categories.prototype, "name_ar", void 0);
__decorate([
    typeorm_1.OneToMany(() => company_tags_1.company_tags, (company_tags) => company_tags.category),
    __metadata("design:type", Array)
], talent_categories.prototype, "companyTagss", void 0);
__decorate([
    typeorm_1.OneToMany(() => job_category_1.job_category, (job_category) => job_category.jobCategory),
    __metadata("design:type", Array)
], talent_categories.prototype, "jobCategorys", void 0);
__decorate([
    typeorm_1.OneToMany(() => users_profile_categories_1.users_profile_categories, (users_profile_categories) => users_profile_categories.talentCategory),
    __metadata("design:type", Array)
], talent_categories.prototype, "usersProfileCategoriess", void 0);
talent_categories = __decorate([
    typeorm_1.Entity("talent_categories", { schema: "public" }),
    typeorm_1.Index("talent_categories_name_en_name_ar_d47bc0cd_uniq", ["name_ar", "name_en",], { unique: true })
], talent_categories);
exports.talent_categories = talent_categories;
//# sourceMappingURL=talent_categories.js.map