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
let height_range_lookup = class height_range_lookup {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], height_range_lookup.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        unique: true,
        length: 50,
        name: "name"
    }),
    __metadata("design:type", String)
], height_range_lookup.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => users_profile_1.users_profile, (users_profile) => users_profile.height),
    __metadata("design:type", Array)
], height_range_lookup.prototype, "usersProfiles", void 0);
height_range_lookup = __decorate([
    typeorm_1.Entity("height_range_lookup", { schema: "public" }),
    typeorm_1.Index("height_range_lookup_name_e023aaa9_like", ["name",]),
    typeorm_1.Index("height_range_lookup_name_key", ["name",], { unique: true })
], height_range_lookup);
exports.height_range_lookup = height_range_lookup;
//# sourceMappingURL=height_range_lookup.js.map