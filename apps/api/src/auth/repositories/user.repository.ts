import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from 'src/database/database.module';
import * as schema from 'src/auth/schema';
import { eq } from 'drizzle-orm';
import { UserFactory } from 'src/auth/domain/user.factory';
import { User } from 'src/auth/domain/user';

@Injectable()
export class UserRepository {
    constructor(
        @Inject(DATABASE_CONNECTION) private readonly database: NodePgDatabase<typeof schema>,
    ) {}

    async find(email: string) {
        const result = await this.database.query.users.findFirst({
            where: eq(schema.users.email, email),
        });

        if (!result) {
            throw new NotFoundException();
        }

        const user = UserFactory.fromPersistence(result);

        return user;
    }
    async register(email: string, password: string) {
        const newUser = await User.create(email, password);
        await this.database.insert(schema.users).values(newUser.toObject());
    }
    async login(email: string, password: string) {
        const user = await this.find(email);
        return user.compare(password);
    }
}
