import { PinoLogger } from 'nestjs-pino';
import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from './users.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersSeeder {
    constructor(
        @Inject('UsersService') private readonly service: UsersService,
        private readonly logger: PinoLogger,
    ) {
        logger.setContext(UsersSeeder.name);
    }

    async seedDatabase(): Promise<number> {
        const recordCount: number = await this.service.count();

        if (recordCount > 0) {
            this.logger.info('UsersSeeder#seedDatabase', 'Aborting...');
            return recordCount;
        }

        // TODO: Add seed data if needed
        // Example:
        // const passwordHash = await bcrypt.hash('password123', 10);
        // const user = await this.service.create({
        //   username: 'admin',
        //   email: 'admin@example.com',
        //   password: 'password123',
        //   acsId: 1001,
        // }, passwordHash);

        return 0;
    }
}

