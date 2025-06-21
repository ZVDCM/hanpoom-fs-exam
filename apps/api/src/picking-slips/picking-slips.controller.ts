import {
    Controller,
    HttpStatus,
    ParseFilePipeBuilder,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('picking-slips')
export class PickingSlipsController {
    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    importCSV(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'text/csv',
                    skipMagicNumbersValidation: true,
                    fallbackToMimetype: true,
                })
                .build({
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
                }),
        )
        file: Express.Multer.File,
    ): string {
        if (!file) {
            throw new Error('No file uploaded');
        }

        return 'CSV file imported successfully';
    }
}
