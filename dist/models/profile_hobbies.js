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
const hobbies_lookup_1 = require("./hobbies_lookup");
const users_profile_1 = require("./users_profile");
let profile_hobbies = class profile_hobbies {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], profile_hobbies.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(() => hobbies_lookup_1.hobbies_lookup, (hobbies_lookup) => hobbies_lookup.profileHobbiess, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'hobbies_id' }),
    __metadata("design:type", hobbies_lookup_1.hobbies_lookup)
], profile_hobbies.prototype, "hobbies", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileHobbiess, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_hobbies.prototype, "userProfile", void 0);
profile_hobbies = __decorate([
    typeorm_1.Entity("profile_hobbies", { schema: "public" }),
    typeorm_1.Index("profile_hobbies_hobbies_id_de4701d1", ["hobbies",]),
    typeorm_1.Index("profile_hobbies_hobbies_id_user_profile_id_5fdc62bc_uniq", ["hobbies", "userProfile",], { unique: true }),
    typeorm_1.Index("profile_hobbies_user_profile_id_350bdd29", ["userProfile",])
], profile_hobbies);
exports.profile_hobbies = profile_hobbies;
//# sourceMappingURL=profile_hobbies.js.map