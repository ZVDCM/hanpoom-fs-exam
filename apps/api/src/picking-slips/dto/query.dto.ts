import { createZodDto } from 'nestjs-zod';
import { querySchema } from '@repo/types';

export class QueryDto extends createZodDto(querySchema) {}
