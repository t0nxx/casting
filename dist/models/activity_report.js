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
const activity_1 = require("./activity");
const auth_user_1 = require("./auth_user");
let activity_report = class activity_report {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], activity_report.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], activity_report.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.activity, (activity) => activity.activityReports, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'activity_id' }),
    __metadata("design:type", activity_1.activity)
], activity_report.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.activityReports, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], activity_report.prototype, "authUser", void 0);
activity_report = __decorate([
    typeorm_1.Entity("activity_report", { schema: "public" }),
    typeorm_1.Index("activity_report_activity_id_7543b38e", ["activity",]),
    typeorm_1.Index("activity_report_auth_user_id_b45b07f6", ["authUser",])
], activity_report);
exports.activity_report = activity_report;
//# sourceMappingURL=activity_report.js.map