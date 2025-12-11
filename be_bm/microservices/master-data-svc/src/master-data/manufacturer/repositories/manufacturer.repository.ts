import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';

@Injectable()
export class ManufacturerRepository extends Repository<Manufacturer> {
    constructor(private dataSource: DataSource) {
        super(Manufacturer, dataSource.createEntityManager());
    }
}
