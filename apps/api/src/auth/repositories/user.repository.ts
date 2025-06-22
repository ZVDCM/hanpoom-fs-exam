import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from 'src/auth/schema';
import { eq } from 'drizzle-orm';
import { UserFactory } from 'src/auth/domain/user-domain/user.factory';
import { User } from 'src/auth/domain/user-domain/user';
import { DrizzleQueryError } from 'drizzle-orm/errors';

@Injectable()
export class UserRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async find(email: string) {
        const result = await this.database.query.users.findFirst({
            where: eq(schema.users.email, email),
        });

        if (!result) throw new NotFoundException();

        const user = UserFactory.fromPersistence(result);

        return user;
    }
    async create(email: string, password: string) {
        try {
            const newUser = await User.create(email, password);
            await this.database.insert(schema.users).values(newUser.toObject());
        } catch (error) {
            const errorMessage =
                error instanceof DrizzleQueryError
                    ? error.cause?.['detail']
                    : 'something went wrong in user create';
            throw new BadRequestException(errorMessage);
        }
    }
    async update(user: User) {
        await this.database.update(schema.users).set(user.toObject());
    }
}
