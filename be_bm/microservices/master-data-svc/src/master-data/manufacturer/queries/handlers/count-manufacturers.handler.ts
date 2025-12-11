import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Manufacturer } from '../../entities/manufacturer.entity';
import { CountManufacturersQuery } from '../../manufacturer.cqrs';

@QueryHandler(CountManufacturersQuery)
export class CountManufacturersHandler implements IQueryHandler<CountManufacturersQuery> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: Repository<Manufacturer>,
    ) { }

    async execute(query: CountManufacturersQuery): Promise<{ count: number }> {
        const { query: filter } = query;
        let where: any = {};

        if (filter && filter.where) {
            try {
                const parsedWhere = JSON.parse(filter.where);
                // Handle basic search by code or name if provided in where
                if (parsedWhere.$or) {
                    where = parsedWhere.$or.map((condition: any) => {
                        if (condition.code && condition.code.$like) {
                            return { code: Like(condition.code.$like) };
                        }
                        if (condition.name && condition.name.$like) {
                            return { name: Like(condition.name.$like) };
                        }
                        return {};
                    });
                } else {
                    where = parsedWhere;
                }
            } catch (e) {
                // If parsing fails, ignore where clause or handle accordingly
            }
        }

        // Use TypeORM's count
        const count = await this.manufacturerRepository.count({ where });
        return { count };
    }
}
