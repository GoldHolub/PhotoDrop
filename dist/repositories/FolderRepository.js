import { db } from '../drizzle/postgresDB.js';
import { folders } from '../drizzle/schema.js';
import { eq, and, inArray } from 'drizzle-orm';
export class FolderRepository {
    async createFolder(name, location, photographerId) {
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
    async deleteFolderById(folderId) {
        const deletedFolder = await db
            .delete(folders)
            .where(eq(folders.id, folderId));
        return deletedFolder;
    }
    async getFoldersByPhotographerId(photographerId) {
        const photographerFolders = await db
            .select()
            .from(folders)
            .where(eq(folders.photographerId, photographerId));
        return photographerFolders;
    }
    async getFolderByIdAndUserId(folderId, photographerId) {
        const photographerFolders = await db
            .select()
            .from(folders)
            .where(and(eq(folders.photographerId, photographerId), eq(folders.id, folderId)))
            .limit(1);
        return photographerFolders[0];
    }
    async getFolderNamesByIds(ids) {
        const folderNames = await db
            .select({ id: folders.id, location: folders.location })
            .from(folders)
            .where(inArray(folders.id, ids));
        return folderNames;
    }
}
//# sourceMappingURL=FolderRepository.js.map