import { db } from '../drizzle/postgresDB.js';
import { eq, and, inArray } from 'drizzle-orm';
import { imageInfo, images, imagesToUsers } from '../drizzle/schema.js';
import { ImageData } from '../services/ImageService.js';


export class ImageRepository {
    async addImageToFolder(imageData: ImageData, imageBuffer: Buffer) {
        const [savedImageInfo] = await db.insert(imageInfo).values({
            name: imageData.name,
            type: imageData.type,
            folderId: imageData.folderId,
            photographerId: imageData.photographerId,
        }).returning({ id: imageInfo.id, name: imageInfo.name });

        const [savedImage] = await db.insert(images).values({
            imageData: imageBuffer,
            imageInfoId: savedImageInfo.id
        })

        return savedImageInfo;
    }

    async getImagesFromFolder(folderId: number) {
        const folderImages = await db
            .select()
            .from(imageInfo)
            .where(eq(imageInfo.folderId, folderId));

        return folderImages;
    }

    async getImageInfoByIds(imageDataIds: number[], photographerId: number) {
        const imageData = await db
            .select()
            .from(imageInfo)
            .where(and(
                inArray(imageInfo.id, imageDataIds),
                eq(imageInfo.photographerId, photographerId)
            ));

        return imageData;
    }

    async getImageById(imageId: number) {
        const image = await db
            .select()
            .from(images)
            .where(eq(images.imageInfoId, imageId))
            .limit(1)

        return image[0];
    }

    async deleteImageByIds(imageIds: number[]) {
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
}