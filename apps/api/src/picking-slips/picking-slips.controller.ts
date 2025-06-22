import { Controller, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportCSVCommand } from 'src/picking-slips/commands/import-csv/import-csv.command';
import { ParseCSVCommand } from 'src/picking-slips/commands/parse-csv/parse-csv.command';
import { PickingSlip } from 'src/picking-slips/domain/picking-slip';
import { PickingSlipDate } from 'src/picking-slips/domain/picking-slip-date';
import { PickingSlipItem } from 'src/picking-slips/domain/picking-slip-item';
import { csvFilePipeBuilder } from 'src/utils/parse-file-pipe-builders';

type Base = 'slip';
type Variant = 'items' | 'dates';

type PickingSlipEntity = `${Base}s` | `${Base}-${Variant}`;

@Controller('picking-slips')
export class PickingSlipsController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post('import/:variant')
    @UseInterceptors(FileInterceptor('file'))
    async importCSV(
        @Param('variant') variant: PickingSlipEntity,
        @UploadedFile(csvFilePipeBuilder)
        file: Express.Multer.File,
    ): Promise<string> {
        let results: (PickingSlip | PickingSlipDate | PickingSlipItem)[] = [];

        switch (variant) {
            case 'slips':
                results = await this.commandBus.execute(new ParseCSVCommand(file, PickingSlip));
                break;
            case 'slip-dates':
                results = await this.commandBus.execute(new ParseCSVCommand(file, PickingSlipDate));
                break;
            case 'slip-items':
                results = await this.commandBus.execute(new ParseCSVCommand(file, PickingSlipItem));
                break;
            default:
                throw new Error(`Unknown variant: ${variant}`);
        }

        switch (variant) {
            case 'slips':
                this.commandBus.execute(new ImportCSVCommand(results, PickingSlip));
                break;
            case 'slip-dates':
                this.commandBus.execute(new ImportCSVCommand(results, PickingSlipDate));
                break;
            case 'slip-items':
                this.commandBus.execute(new ImportCSVCommand(results, PickingSlipItem));
                break;
            default:
                throw new Error(`Unknown variant: ${variant}`);
        }

        return `${file.originalname} imported successfully`;
    }
}
