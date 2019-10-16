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
const socialaccount_socialapp_sites_1 = require("./socialaccount_socialapp_sites");
let django_site = class django_site {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], django_site.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 100,
        name: "domain"
    }),
    __metadata("design:type", String)
], django_site.prototype, "domain", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        length: 50,
        name: "name"
    }),
    __metadata("design:type", String)
], django_site.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => socialaccount_socialapp_sites_1.socialaccount_socialapp_sites, (socialaccount_socialapp_sites) => socialaccount_socialapp_sites.site),
    __metadata("design:type", Array)
], django_site.prototype, "socialaccountSocialappSitess", void 0);
django_site = __decorate([
    typeorm_1.Entity("django_site", { schema: "public" }),
    typeorm_1.Index("django_site_domain_a2e37b91_like", ["domain",]),
    typeorm_1.Index("django_site_domain_a2e37b91_uniq", ["domain",], { unique: true })
], django_site);
exports.django_site = django_site;
//# sourceMappingURL=django_site.js.map