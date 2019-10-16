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
const auth_user_1 = require("./auth_user");
const account_emailconfirmation_1 = require("./account_emailconfirmation");
let account_emailaddress = class account_emailaddress {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], account_emailaddress.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 254,
        name: "email"
    }),
    __metadata("design:type", String)
], account_emailaddress.prototype, "email", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "verified"
    }),
    __metadata("design:type", Boolean)
], account_emailaddress.prototype, "verified", void 0);
__decorate([
    typeorm_1.Column("boolean", {
        nullable: false,
        name: "primary"
    }),
    __metadata("design:type", Boolean)
], account_emailaddress.prototype, "primary", void 0);
__decorate([
    typeorm_1.ManyToOne(() => auth_user_1.auth_user, (auth_user) => auth_user.accountEmailaddresss, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'user_id' }),
    __metadata("design:type", auth_user_1.auth_user)
], account_emailaddress.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(() => account_emailconfirmation_1.account_emailconfirmation, (account_emailconfirmation) => account_emailconfirmation.emailAddress),
    __metadata("design:type", Array)
], account_emailaddress.prototype, "accountEmailconfirmations", void 0);
account_emailaddress = __decorate([
    typeorm_1.Entity("account_emailaddress", { schema: "public" }),
    typeorm_1.Index("account_emailaddress_email_key", ["email",], { unique: true }),
    typeorm_1.Index("account_emailaddress_email_03be32b2_like", ["email",]),
    typeorm_1.Index("account_emailaddress_user_id_2c513194", ["user",])
], account_emailaddress);
exports.account_emailaddress = account_emailaddress;
//# sourceMappingURL=account_emailaddress.js.map