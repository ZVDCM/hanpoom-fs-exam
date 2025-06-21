import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

export const csvFilePipeBuilder = new ParseFilePipeBuilder()
    .addFileTypeValidator({
        fileType: 'text/csv',
        skipMagicNumbersValidation: true,
        fallbackToMimetype: true,
    })
    .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    });
