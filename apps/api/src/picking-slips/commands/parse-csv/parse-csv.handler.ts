import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { ParseCSVCommand } from 'src/picking-slips/commands/parse-csv/parse-csv.command';

@CommandHandler(ParseCSVCommand)
export class ParseCSVHandler<TEntity> implements ICommandHandler<ParseCSVCommand<TEntity>> {
    async execute({ file, EntityType }: ParseCSVCommand<TEntity>) {
        const results: TEntity[] = [];

        const stream = Readable.from(file.buffer);

        await new Promise<void>((resolve, reject) => {
            stream
                .pipe(
                    csv({
                        mapValues: ({ value }) => (value === '' ? null : value),
                    }),
                )
                .on('data', (data: object) => {
                    const values = Object.values(data);
                    results.push(new EntityType(...values));
                })
                .on('end', () => resolve())
                .on('error', (err) => reject(err));
        });

        return results;
    }
}
