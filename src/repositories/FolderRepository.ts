import { db } from '../drizzle/postgresDB.js';
import { folders } from '../drizzle/schema.js';
import { eq, and, inArray } from 'drizzle-orm';

export class FolderRepository {
    async createFolder(name: string, location: string, photographerId: number) {
        const [newFolder] = await db
            .insert(folders)
            .values({
                name,
                photographerId,
                location
            })
            .returning({ id: folders.id, name: folders.name, location: folders.location, created: folders.createdAt });

        return newFolder;
    }

    async deleteFolderById(folderId: number) {
        const deletedFolder = await db
            .delete(folders)
            .where(eq(folders.id, folderId));
        return deletedFolder;
    }

    async getFoldersByPhotographerId(photographerId: number) {
        const photographerFolders = await db
            .select()
            .from(folders)
            .where(eq(folders.photographerId, photographerId));

        return photographerFolders;
    }

    async getFolderByIdAndUserId(folderId: number, photographerId: number) {
        const photographerFolders = await db
            .select()
            .from(folders)
            .where(and(
                eq(folders.photographerId, photographerId),
                eq(folders.id, folderId))
            )
            .limit(1);

        return photographerFolders[0];
    }

    async getFolderNamesByIds(ids: number[]) {
        const folderNames = await db
            .select({ id: folders.id, location: folders.location })
            .from(folders)
            .where(inArray(folders.id, ids));

        return folderNames;    
    }
}