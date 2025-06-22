import {
    Controller,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'nestjs-zod';
import { ImportCSVCommand } from 'src/picking-slips/commands/import-csv/import-csv.command';
import { ParseCSVCommand } from 'src/picking-slips/commands/parse-csv/parse-csv.command';
import { PickingSlip } from 'src/picking-slips/domain/picking-slip';
import { PickingSlipDate } from 'src/picking-slips/domain/picking-slip-date';
import { PickingSlipItem } from 'src/picking-slips/domain/picking-slip-item';
import { QueryDto } from 'src/picking-slips/dto/query.dto';
import { GetPickingSlipsQuery } from 'src/picking-slips/queries/get-picking-slips/get-picking-slips.query';
import { PickingSlipResponse } from 'src/types/picking-slip';
import { csvFilePipeBuilder } from 'src/utils/parse-file-pipe-builders';

type Base = 'slip';
type Variant = 'items' | 'dates';

type PickingSlipEntity = `${Base}s` | `${Base}-${Variant}`;

@Controller('picking-slips')
export class PickingSlipsController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @UsePipes(ZodValidationPipe)
    @Get()
    async getAll(@Query() queryDto: QueryDto): Promise<PickingSlipResponse[]> {
        const results = this.queryBus.execute(
            new GetPickingSlipsQuery(
                queryDto.status,
                queryDto.sort,
                queryDto.page,
                queryDto.pageSize,
            ),
        );
        return results;
    }

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
