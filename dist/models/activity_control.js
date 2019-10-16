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
let activity_control = class activity_control {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], activity_control.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "publish_date"
    }),
    __metadata("design:type", Date)
], activity_control.prototype, "publish_date", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_hidden"
    }),
    __metadata("design:type", Boolean)
], activity_control.prototype, "is_hidden", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_saved"
    }),
    __metadata("design:type", Boolean)
], activity_control.prototype, "is_saved", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "is_reported"
    }),
    __metadata("design:type", Boolean)
], activity_control.prototype, "is_reported", void 0);
__decorate([
    typeorm_1.ManyToOne(() => activity_1.activity, (activity) => activity.activityControls, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'activity_id' }),
    __metadata("design:type", activity_1.activity)
], activity_control.prototype, "activity", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.activityControls, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'auth_user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], activity_control.prototype, "authUser", void 0);
activity_control = __decorate([
    typeorm_1.Entity("activity_control", { schema: "public" }),
    typeorm_1.Index("activity_control_activity_id_f7720356", ["activity",]),
    typeorm_1.Index("activity_control_auth_user_id_151efd70", ["authUser",])
], activity_control);
exports.activity_control = activity_control;
//# sourceMappingURL=activity_control.js.map