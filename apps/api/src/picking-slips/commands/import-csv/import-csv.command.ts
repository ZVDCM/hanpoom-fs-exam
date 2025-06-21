import { Command } from '@nestjs/cqrs';

export class ImportCSVCommand<TEntity> extends Command<void> {
    constructor(
        public readonly results: TEntity[],
        public readonly EntityType: new (...args: any[]) => TEntity,
    ) {
        super();
    }
}
