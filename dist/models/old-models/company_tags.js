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
const talent_categories_1 = require("./talent_categories");
const company_1 = require("./company");
let company_tags = class company_tags {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], company_tags.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => talent_categories_1.talent_categories, (talent_categories) => talent_categories.companyTagss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'category_id' }),
    __metadata("design:type", talent_categories_1.talent_categories)
], company_tags.prototype, "category", void 0);
__decorate([
    typeorm_1.ManyToOne(() => company_1.company, (company) => company.companyTagss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'company_id' }),
    __metadata("design:type", company_1.company)
], company_tags.prototype, "company", void 0);
company_tags = __decorate([
    typeorm_1.Entity("company_tags", { schema: "public" }),
    typeorm_1.Index("company_tags_category_id_ed89aef0", ["category",]),
    typeorm_1.Index("company_tags_company_id_15da15ae", ["company",])
], company_tags);
exports.company_tags = company_tags;
//# sourceMappingURL=company_tags.js.map