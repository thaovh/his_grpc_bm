"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchRepository = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class BranchRepository {
    branchRepository;
    logger;
    constructor(
    @(0, typeorm_1.InjectRepository)(branch_entity_1.Branch)
    branchRepository, logger) {
        this.branchRepository = branchRepository;
        this.logger = logger;
        this.logger.setContext(BranchRepository.name);
    }
    async create(branchDto) {
        this.logger.info('BranchRepository#create.call', { code: branchDto.code, createdBy: branchDto.createdBy });
        const { randomUUID } = require('crypto');
        const id = randomUUID();
        const now = new Date();
        const branchData = {
            id,
            code: branchDto.code,
            name: branchDto.name,
            address: branchDto.address ?? null,
            isActive: 1,
            version: 1,
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
            createdBy: branchDto.createdBy ?? null,
            updatedBy: branchDto.createdBy ?? null,
        };
        const branch = this.branchRepository.create(branchData);
        await this.branchRepository.save(branch);
        const savedBranch = await this.branchRepository.findOne({ where: { id } });
        if (!savedBranch)
            throw new Error('Failed to fetch created Branch');
        this.logger.info('BranchRepository#create.result', { id: savedBranch.id, code: savedBranch.code });
        return savedBranch;
    }
    async update(id, branchDto) {
        this.logger.info('BranchRepository#update.call', { id, updatedBy: branchDto.updatedBy });
        const branch = await this.branchRepository.findOne({ where: { id } });
        if (!branch)
            throw new Error(`Branch with id ${id} not found`);
        if (branchDto.code !== undefined)
            branch.code = branchDto.code;
        if (branchDto.name !== undefined)
            branch.name = branchDto.name;
        if (branchDto.address !== undefined)
            branch.address = branchDto.address ?? null;
        if (branchDto.updatedBy !== undefined && branchDto.updatedBy !== null) {
            branch.updatedBy = branchDto.updatedBy;
        }
        branch.updatedAt = new Date();
        branch.version += 1;
        await this.branchRepository.save(branch);
        const updatedBranch = await this.branchRepository.findOne({ where: { id } });
        if (!updatedBranch)
            throw new Error('Failed to fetch updated Branch');
        this.logger.info('BranchRepository#update.result', { id: updatedBranch.id });
        return updatedBranch;
    }
    async findAll(options) {
        this.logger.info('BranchRepository#findAll.call', options);
        const result = await this.branchRepository.find({
            ...options,
            order: options?.order || { name: 'ASC' },
        });
        this.logger.info('BranchRepository#findAll.result', { count: result.length });
        return result;
    }
    async findOne(id) {
        return this.branchRepository.findOne({ where: { id } });
    }
    async findByCode(code) {
        return this.branchRepository.findOne({ where: { code } });
    }
    async count(options) {
        return this.branchRepository.count(options);
    }
    async delete(id) {
        await this.branchRepository.delete(id);
    }
}
exports.BranchRepository = BranchRepository;
