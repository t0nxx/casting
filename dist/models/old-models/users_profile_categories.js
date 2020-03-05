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
const users_profile_1 = require("./users_profile");
let users_profile_categories = class users_profile_categories {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], users_profile_categories.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => talent_categories_1.talent_categories, (talent_categories) => talent_categories.usersProfileCategoriess, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'talent_category_id' }),
    __metadata("design:type", talent_categories_1.talent_categories)
], users_profile_categories.prototype, "talentCategory", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.usersProfileCategoriess, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], users_profile_categories.prototype, "userProfile", void 0);
users_profile_categories = __decorate([
    typeorm_1.Entity("users_profile_categories", { schema: "public" }),
    typeorm_1.Index("users_profile_categories_talent_category_id_09579968", ["talentCategory",]),
    typeorm_1.Index("users_profile_categories_user_profile_id_talent_c_4de59dba_uniq", ["talentCategory", "userProfile",], { unique: true }),
    typeorm_1.Index("users_profile_categories_user_profile_id_d914a4d0", ["userProfile",])
], users_profile_categories);
exports.users_profile_categories = users_profile_categories;
//# sourceMappingURL=users_profile_categories.js.map