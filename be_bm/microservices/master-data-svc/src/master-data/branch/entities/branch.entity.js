"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Branch = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../../../commons/entities/base.entity");
@(0, typeorm_1.Entity)('HIS_BRANCH')
class Branch extends base_entity_1.BaseEntity {
    @(0, typeorm_1.Column)({ name: 'BRANCH_CODE', unique: true })
    code;
    @(0, typeorm_1.Column)({ name: 'BRANCH_NAME' })
    name;
    @(0, typeorm_1.Column)({ name: 'ADDRESS', nullable: true })
    address;
}
exports.Branch = Branch;
