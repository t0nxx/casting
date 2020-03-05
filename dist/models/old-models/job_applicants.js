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
let job_applicants = class job_applicants {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], job_applicants.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "applied_date"
    }),
    __metadata("design:type", Date)
], job_applicants.prototype, "applied_date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => jobs_1.jobs, (jobs) => jobs.jobApplicantss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'job_id' }),
    __metadata("design:type", jobs_1.jobs)
], job_applicants.prototype, "job", void 0);
__decorate([
    typeorm_1.ManyToOne(() => users_profile_1.users_profile, (users_profile) => users_profile.jobApplicantss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'profile_id' }),
    __metadata("design:type", users_profile_1.users_profile)
], job_applicants.prototype, "profile", void 0);
job_applicants = __decorate([
    typeorm_1.Entity("job_applicants", { schema: "public" }),
    typeorm_1.Index("job_applicants_job_id_57dc0d3b", ["job",]),
    typeorm_1.Index("job_applicants_profile_id_4c5e1a1f", ["profile",])
], job_applicants);
exports.job_applicants = job_applicants;
//# sourceMappingURL=job_applicants.js.map