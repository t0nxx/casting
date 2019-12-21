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
const activity_1 = require("./activity");
let ActivityReports = class ActivityReports {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ActivityReports.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], ActivityReports.prototype, "reason", void 0);
__decorate([
    typeorm_1.ManyToOne(type => users_profile_1.Profile, p => p.activity_reports),
    __metadata("design:type", users_profile_1.Profile)
], ActivityReports.prototype, "profile", void 0);
__decorate([
    typeorm_1.ManyToOne(type => activity_1.Activity, a => a.reports),
    __metadata("design:type", activity_1.Activity)
], ActivityReports.prototype, "activity", void 0);
ActivityReports = __decorate([
    typeorm_1.Entity('activity_reports')
], ActivityReports);
exports.ActivityReports = ActivityReports;
//# sourceMappingURL=activity_reports.js.map