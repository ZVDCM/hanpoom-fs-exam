import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { PickingSlipsController } from './picking-slips.controller';
import { PickingSlipsRepository } from 'src/picking-slips/repositories/picking-slips.repository';
import { ParseCSVHandler } from 'src/picking-slips/commands/parse-csv/parse-csv.handler';
import { ImportCSVHandler } from 'src/picking-slips/commands/import-csv/import-csv.handler';
import { PickingSlipDatesRepository } from 'src/picking-slips/repositories/picking-slip-dates.repository';
import { PickingSlipItemsRepository } from 'src/picking-slips/repositories/picking-slip-items.repository';
import { GetPickingSlipsHandler } from 'src/picking-slips/queries/get-picking-slips/get-picking-slips.handler';

@Module({
    imports: [DatabaseModule],
    controllers: [PickingSlipsController],
    providers: [
        PickingSlipsRepository,
        PickingSlipDatesRepository,
        PickingSlipItemsRepository,
        ParseCSVHandler,
        ImportCSVHandler,
        GetPickingSlipsHandler,
    ],
})
export class PickingSlipsModule {}
