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
const profile_hobbies_1 = require("./profile_hobbies");
let hobbies_lookup = class hobbies_lookup {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], hobbies_lookup.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: true,
        unique: true,
        length: 150,
        name: "name"
    }),
    __metadata("design:type", String)
], hobbies_lookup.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(() => profile_hobbies_1.profile_hobbies, (profile_hobbies) => profile_hobbies.hobbies),
    __metadata("design:type", Array)
], hobbies_lookup.prototype, "profileHobbiess", void 0);
hobbies_lookup = __decorate([
    typeorm_1.Entity("hobbies_lookup", { schema: "public" }),
    typeorm_1.Index("hobbies_lookup_name_key", ["name",], { unique: true }),
    typeorm_1.Index("hobbies_lookup_name_e285085a_like", ["name",])
], hobbies_lookup);
exports.hobbies_lookup = hobbies_lookup;
//# sourceMappingURL=hobbies_lookup.js.map