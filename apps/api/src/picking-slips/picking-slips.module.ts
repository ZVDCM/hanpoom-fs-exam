import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CqrsModule } from '@nestjs/cqrs';
import { PickingSlipsController } from './picking-slips.controller';

@Module({
    imports: [DatabaseModule, CqrsModule],
    controllers: [PickingSlipsController],
})
export class PickingSlipsModule {}
