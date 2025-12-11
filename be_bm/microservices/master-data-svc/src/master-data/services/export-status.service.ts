import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';

import { ExportStatus } from '../export-status/entities/export-status.entity';
import { CreateExportStatusDto } from '../export-status/dto/create-export-status.dto';
import { UpdateExportStatusDto } from '../export-status/dto/update-export-status.dto';

import { CreateExportStatusCommand } from '../export-status/commands/create-export-status.command';
import { UpdateExportStatusCommand } from '../export-status/commands/update-export-status.command';
import { GetExportStatusesQuery } from '../export-status/queries/get-export-statuses.query';
import { GetExportStatusByIdQuery } from '../export-status/queries/get-export-status-by-id.query';
import { GetExportStatusByCodeQuery } from '../export-status/queries/get-export-status-by-code.query';
import { CountExportStatusesQuery } from '../export-status/queries/count-export-statuses.query';
import { ExportStatusRepository } from '../export-status/repositories/export-status.repository';

@Injectable()
export class ExportStatusService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly repository: ExportStatusRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExportStatusService.name);
  }

  async findAll(query?: FindManyOptions<ExportStatus>): Promise<Array<ExportStatus>> {
    this.logger.info('ExportStatusService#findAll.call', query);
    return this.queryBus.execute(new GetExportStatusesQuery(query));
  }

  async findById(id: string): Promise<ExportStatus | null> {
    this.logger.info('ExportStatusService#findById.call', { id });
    return this.queryBus.execute(new GetExportStatusByIdQuery(id));
  }

  async findByCode(code: string): Promise<ExportStatus | null> {
    this.logger.info('ExportStatusService#findByCode.call', { code });
    return this.queryBus.execute(new GetExportStatusByCodeQuery(code));
  }

  async count(query?: FindManyOptions<ExportStatus>): Promise<number> {
    this.logger.info('ExportStatusService#count.call', query);
    return this.queryBus.execute(new CountExportStatusesQuery(query));
  }

  async create(exportStatusDto: CreateExportStatusDto): Promise<ExportStatus> {
    this.logger.info('ExportStatusService#create.call', { code: exportStatusDto.code });
    return this.commandBus.execute(new CreateExportStatusCommand(exportStatusDto));
  }

  async update(id: string, exportStatusDto: UpdateExportStatusDto): Promise<ExportStatus> {
    this.logger.info('ExportStatusService#update.call', { id });
    return this.commandBus.execute(new UpdateExportStatusCommand(id, exportStatusDto));
  }

  async delete(id: string): Promise<void> {
    this.logger.info('ExportStatusService#delete.call', { id });
    await this.repository.delete(id);
  }
}

