import { db } from "../drizzle/postgresDB.js";
import { imageInfo, imagesToUsers, images } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
export class ClientImagesRepository {
    async findImagesByClient(clientId) {
        const images = await db
            .select({ imageId: imageInfo.id, folderId: imageInfo.folderId, isPurchased: imageInfo.isPurchased, date: imageInfo.createdAt })
            .from(imagesToUsers)
            .where(eq(imagesToUsers.userId, clientId))
            .leftJoin(imageInfo, eq(imagesToUsers.imageInfoId, imageInfo.id));
        return images;
    }
    async getImageById(imageId) {
        const [image] = await db
            .select()
            .from(images)
            .where(eq(images.imageInfoId, imageId))
            .limit(1);
        return image;
    }
}
//# sourceMappingURL=ClientImagesRepository.js.map