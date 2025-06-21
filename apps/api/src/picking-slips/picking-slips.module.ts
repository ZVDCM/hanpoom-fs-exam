import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
    imports: [DatabaseModule, CqrsModule],
})
export class PickingSlipsModule {}
