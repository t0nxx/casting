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
const account_emailaddress_1 = require("./account_emailaddress");
let account_emailconfirmation = class account_emailconfirmation {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({
        type: "integer",
        name: "id"
    }),
    __metadata("design:type", Number)
], account_emailconfirmation.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: false,
        name: "created"
    }),
    __metadata("design:type", Date)
], account_emailconfirmation.prototype, "created", void 0);
__decorate([
    typeorm_1.Column("timestamp with time zone", {
        nullable: true,
        name: "sent"
    }),
    __metadata("design:type", Date)
], account_emailconfirmation.prototype, "sent", void 0);
__decorate([
    typeorm_1.Column("character varying", {
        nullable: false,
        unique: true,
        length: 64,
        name: "key"
    }),
    __metadata("design:type", String)
], account_emailconfirmation.prototype, "key", void 0);
__decorate([
    typeorm_1.ManyToOne(() => account_emailaddress_1.account_emailaddress, (account_emailaddress) => account_emailaddress.accountEmailconfirmations, { nullable: false, }),
    typeorm_1.JoinColumn({ name: 'email_address_id' }),
    __metadata("design:type", account_emailaddress_1.account_emailaddress)
], account_emailconfirmation.prototype, "emailAddress", void 0);
account_emailconfirmation = __decorate([
    typeorm_1.Entity("account_emailconfirmation", { schema: "public" }),
    typeorm_1.Index("account_emailconfirmation_email_address_id_5b7f8c58", ["emailAddress",]),
    typeorm_1.Index("account_emailconfirmation_key_f43612bd_like", ["key",]),
    typeorm_1.Index("account_emailconfirmation_key_key", ["key",], { unique: true })
], account_emailconfirmation);
exports.account_emailconfirmation = account_emailconfirmation;
//# sourceMappingURL=account_emailconfirmation.js.map