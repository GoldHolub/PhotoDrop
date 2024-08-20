import { FolderRepository } from "../repositories/FolderRepository.js";
import { ImageRepository } from "../repositories/ImageRepository.js";
export class FolderService {
    folderRepository;
    imageRepository;
    constructor() {
        this.folderRepository = new FolderRepository();
        this.imageRepository = new ImageRepository();
    }
    async createFolder(name, location, photographerId) {
        if (!name || !location) {
            throw new Error(`Please provide name and folder location`);
        }
        return this.folderRepository.createFolder(name, location, photographerId);
    }
    async deleteFolderById(folderId, photographerId) {
        const folder = await this.folderRepository.getFolderByIdAndUserId(folderId, photographerId);
        if (!folder) {
            throw new Error('Folder not found or not owned by this photographer');
        }
        const images = await this.imageRepository.getImagesFromFolder(folder.id);
        const imageIds = [];
        images.forEach((image) => {
            imageIds.push(image.id);
        });
        const deletedImages = await this.imageRepository.deleteImageByIds(imageIds);
        const deletedFolder = await this.folderRepository.deleteFolderById(folderId);
        return deletedFolder;
    }
    async getFoldersByPhotographerId(photographerId) {
        return this.folderRepository.getFoldersByPhotographerId(photographerId);
    }
}
//# sourceMappingURL=FolderService.js.map