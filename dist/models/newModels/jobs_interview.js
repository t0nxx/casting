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
const class_validator_1 = require("class-validator");
const users_profile_1 = require("./users_profile");
const jobs_1 = require("./jobs");
let JobInterview = class JobInterview {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], JobInterview.prototype, "id", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'interview_date is required' }),
    typeorm_1.Column(),
    __metadata("design:type", Date)
], JobInterview.prototype, "interview_date", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'interviewer is required' }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], JobInterview.prototype, "interviewer", void 0);
__decorate([
    class_validator_1.IsNotEmpty({ message: 'location is required' }),
    typeorm_1.Column(),
    __metadata("design:type", String)
], JobInterview.prototype, "location", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.interview_jobs, { onDelete: 'CASCADE' }),
    __metadata("design:type", users_profile_1.Profile)
], JobInterview.prototype, "profile", void 0);
__decorate([
    typeorm_1.ManyToOne(type => jobs_1.Jobs, j => j.interviews, { onDelete: 'CASCADE' }),
    __metadata("design:type", jobs_1.Jobs)
], JobInterview.prototype, "job", void 0);
JobInterview = __decorate([
    typeorm_1.Entity('job_interview')
], JobInterview);
exports.JobInterview = JobInterview;
//# sourceMappingURL=jobs_interview.js.map