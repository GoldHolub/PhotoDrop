import { db } from "../drizzle/postgresDB.js";
import { Photographer } from "../drizzle/schema.js";
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export class PhotographerRepository {
    async findPhotographerByUsername(username: string) {
        const photographer = await db.select()
            .from(Photographer)
            .where(eq(Photographer.username, username))
            .limit(1);

        return photographer[0];
    }

    async create(username: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const photographer = await db.insert(Photographer)
            .values({ username, password: hashedPassword })
            .returning({username: Photographer.username});

        return photographer[0];
    }
}