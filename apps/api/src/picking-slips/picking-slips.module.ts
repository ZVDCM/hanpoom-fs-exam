import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PickingSlipsController } from './picking-slips.controller';
import { PickingSlipsRepository } from 'src/picking-slips/repositories/picking-slips.repository';
import { ParseCSVHandler } from 'src/picking-slips/commands/parse-csv/parse-csv.handler';
import { ImportCSVHandler } from 'src/picking-slips/commands/import-csv/import-csv.handler';
import { PickingSlipDatesRepository } from 'src/picking-slips/repositories/picking-slip-dates.repository';
import { PickingSlipItemsRepository } from 'src/picking-slips/repositories/picking-slip-items.repository';

@Module({
    imports: [DatabaseModule, CqrsModule],
    controllers: [PickingSlipsController],
    providers: [
        PickingSlipsRepository,
        PickingSlipDatesRepository,
        PickingSlipItemsRepository,
        ParseCSVHandler,
        ImportCSVHandler,
    ],
})
export class PickingSlipsModule {}
