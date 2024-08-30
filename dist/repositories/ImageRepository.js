import { db } from '../drizzle/postgresDB.js';
import { eq, and, inArray } from 'drizzle-orm';
import { imageInfo, images, imagesToUsers } from '../drizzle/schema.js';
export class ImageRepository {
    async addImageToFolder(imageData, imageBuffer) {
        const [savedImageInfo] = await db.insert(imageInfo).values({
            name: imageData.name,
            type: imageData.type,
            folderId: imageData.folderId,
            photographerId: imageData.photographerId,
        }).returning({ id: imageInfo.id, name: imageInfo.name });
        const [savedImage] = await db.insert(images).values({
            imageData: imageBuffer,
            imageInfoId: savedImageInfo.id
        });
        return savedImageInfo;
    }
    async getImagesFromFolder(folderId) {
        const folderImages = await db
            .select()
            .from(imageInfo)
            .where(eq(imageInfo.folderId, folderId));
        return folderImages;
    }
    async getImageInfoByIds(imageDataIds, photographerId) {
        const imageData = await db
            .select()
            .from(imageInfo)
            .where(and(inArray(imageInfo.id, imageDataIds), eq(imageInfo.photographerId, photographerId)));
        return imageData;
    }
    async getImageById(imageId) {
        const image = await db
            .select()
            .from(images)
            .where(eq(images.imageInfoId, imageId))
            .limit(1);
        return image[0];
    }
    async deleteImageByIds(imageIds) {
        const deletedCouplings = await db
            .delete(imagesToUsers)
            .where(inArray(imagesToUsers.imageInfoId, imageIds));
        const deletedImage = await db
            .delete(images)
            .where(inArray(images.imageInfoId, imageIds));
        const deletedImageData = await db
            .delete(imageInfo)
            .where(inArray(imageInfo.id, imageIds))
            .returning();
        return deletedImageData;
    }
    async getAllImageInfo() {
        const imagesInfo = await db
            .select()
            .from(imageInfo);
        return imagesInfo;
    }
    async getImageToUsersInfo() {
        const imagesToUsersInfo = await db
            .select()
            .from(imagesToUsers);
        return imagesToUsersInfo;
    }
    async insertImageUserPairs(insertValues) {
        if (insertValues.length > 0) {
            await db
                .insert(imagesToUsers)
                .values(insertValues);
        }
    }
    async buyImagesByIds(imageIds) {
        const purchasedImages = await db
            .update(imageInfo)
            .set({ isPurchased: true })
            .where(inArray(imageInfo.id, imageIds))
            .returning({ id: imageInfo.id, isPurchased: imageInfo.isPurchased });
        return purchasedImages;
    }
}
//# sourceMappingURL=ImageRepository.js.map