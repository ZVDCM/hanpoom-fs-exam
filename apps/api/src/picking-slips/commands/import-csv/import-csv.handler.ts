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
        private readonly pickingSlipsRepository: PickingSlipsRepository,
        private readonly pickingSlipDatesRepository: PickingSlipDatesRepository,
        private readonly pickingSlipItemsRepository: PickingSlipItemsRepository,
    ) {}

    async execute({ results, EntityType }: ImportCSVCommand<TEntity>) {
        switch (EntityType) {
            case PickingSlip:
                await this.pickingSlipsRepository.import(results as PickingSlip[]);
                break;
            case PickingSlipDate:
                await this.pickingSlipDatesRepository.import(results as PickingSlipDate[]);
                break;
            case PickingSlipItem:
                await this.pickingSlipItemsRepository.import(results as PickingSlipItem[]);
                break;
            default:
                throw new Error(`Unknown entity type: ${EntityType.name}`);
        }
    }
}
