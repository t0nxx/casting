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
let profile_training = class profile_training {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], profile_training.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 150,
        name: "course_name"
    }),
    __metadata("design:type", String)
], profile_training.prototype, "course_name", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 150,
        name: "institute"
    }),
    __metadata("design:type", String)
], profile_training.prototype, "institute", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.profileTrainings, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], profile_training.prototype, "userProfile", void 0);
profile_training = __decorate([
    typeorm_1.Entity("profile_training", { schema: "public" }),
    typeorm_1.Index("profile_training_course_name_institute_us_33bccca1_uniq", ["course_name", "institute", "userProfile",], { unique: true }),
    typeorm_1.Index("profile_training_user_profile_id_9393669f", ["userProfile",])
], profile_training);
exports.profile_training = profile_training;
//# sourceMappingURL=profile_training.js.map