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
const users_profile_1 = require("./users_profile");
let job_shortlisted = class job_shortlisted {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], job_shortlisted.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "shortlisted_date"
    }),
    __metadata("design:type", Date)
], job_shortlisted.prototype, "shortlisted_date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => jobs_1.jobs, (jobs) => jobs.jobShortlisteds, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'job_id' }),
    __metadata("design:type", jobs_1.jobs)
], job_shortlisted.prototype, "job", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.jobShortlisteds, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], job_shortlisted.prototype, "profile", void 0);
job_shortlisted = __decorate([
    typeorm_1.Entity("job_shortlisted", { schema: "public" }),
    typeorm_1.Index("job_shortlisted_job_id_b51d05f1", ["job",]),
    typeorm_1.Index("job_shortlisted_profile_id_50ec5dd8", ["profile",])
], job_shortlisted);
exports.job_shortlisted = job_shortlisted;
//# sourceMappingURL=job_shortlisted.js.map