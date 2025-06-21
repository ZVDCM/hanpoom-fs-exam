import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { csvFilePipeBuilder } from 'src/utils/parse-file-pipe-builders';

@Controller('picking-slips')
export class PickingSlipsController {
    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    importCSV(
        @UploadedFile(csvFilePipeBuilder)
        file: Express.Multer.File,
    ): string {
        if (!file) {
            throw new Error('No file uploaded');
        }

        return 'CSV file imported successfully';
    }
}
