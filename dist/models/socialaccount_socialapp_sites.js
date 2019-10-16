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
const socialaccount_socialapp_1 = require("./socialaccount_socialapp");
const django_site_1 = require("./django_site");
let socialaccount_socialapp_sites = class socialaccount_socialapp_sites {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], socialaccount_socialapp_sites.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => socialaccount_socialapp_1.socialaccount_socialapp, (socialaccount_socialapp) => socialaccount_socialapp.socialaccountSocialappSitess, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'socialapp_id' }),
    __metadata("design:type", socialaccount_socialapp_1.socialaccount_socialapp)
], socialaccount_socialapp_sites.prototype, "socialapp", void 0);
__decorate([
    typeorm_1.ManyToOne(() => django_site_1.django_site, (django_site) => django_site.socialaccountSocialappSitess, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'site_id' }),
    __metadata("design:type", django_site_1.django_site)
], socialaccount_socialapp_sites.prototype, "site", void 0);
socialaccount_socialapp_sites = __decorate([
    typeorm_1.Entity("socialaccount_socialapp_sites", { schema: "public" }),
    typeorm_1.Index("socialaccount_socialapp_sites_site_id_2579dee5", ["site",]),
    typeorm_1.Index("socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq", ["site", "socialapp",], { unique: true }),
    typeorm_1.Index("socialaccount_socialapp_sites_socialapp_id_97fb6e7d", ["socialapp",])
], socialaccount_socialapp_sites);
exports.socialaccount_socialapp_sites = socialaccount_socialapp_sites;
//# sourceMappingURL=socialaccount_socialapp_sites.js.map