import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImportCSVCommand } from 'src/picking-slips/commands/import-csv/import-csv.command';
import { PickingSlip } from 'src/picking-slips/domain/picking-slip';
import { PickingSlipDate } from 'src/picking-slips/domain/picking-slip-date';
import { PickingSlipItem } from 'src/picking-slips/domain/picking-slip-item';
import { PickingSlipDatesRepository } from 'src/picking-slips/repositories/picking-slip-dates.repository';
import { PickingSlipItemsRepository } from 'src/picking-slips/repositories/picking-slip-items.repository';
import { PickingSlipsRepository } from 'src/picking-slips/repositories/picking-slips.repository';

@CommandHandler(ImportCSVCommand)
export class ImportCSVHandler<TEntity> implements ICommandHandler<ImportCSVCommand<TEntity>> {
    constructor(
        private readonly pickingSlips: PickingSlipsRepository,
        private readonly pickingSlipDates: PickingSlipDatesRepository,
        private readonly pickingSlipItems: PickingSlipItemsRepository,
    ) {}

    async execute({ results, EntityType }: ImportCSVCommand<TEntity>) {
        switch (EntityType) {
            case PickingSlip:
                this.pickingSlips.import(results as PickingSlip[]);
                break;
            case PickingSlipDate:
                this.pickingSlipDates.import(results as PickingSlipDate[]);
                break;
            case PickingSlipItem:
                this.pickingSlipItems.import(results as PickingSlipItem[]);
                break;
            default:
                throw new Error(`Unknown entity type: ${EntityType.name}`);
        }
    }
}
