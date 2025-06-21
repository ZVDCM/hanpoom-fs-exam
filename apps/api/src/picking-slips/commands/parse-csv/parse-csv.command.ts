import { Command } from '@nestjs/cqrs';

export class ParseCSVCommand<TEntity> extends Command<TEntity[]> {
    constructor(
        public readonly file: Express.Multer.File,
        public readonly EntityType: new (...args: any[]) => TEntity,
    ) {
        super();
    }
}
