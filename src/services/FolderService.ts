import { FolderRepository } from "../repositories/FolderRepository.js";
import { ImageRepository } from "../repositories/ImageRepository.js";

export class FolderService {
    private folderRepository: FolderRepository;
    private imageRepository: ImageRepository;

    constructor() {
        this.folderRepository = new FolderRepository();
        this.imageRepository = new ImageRepository();
    }

    async createFolder(name: string, location: string, photographerId: number) {
        if (!name || !location) {
            throw new Error(`Please provide name and folder location`);
        }

        return this.folderRepository.createFolder(name, location, photographerId);
    }

    async deleteFolderById(folderId: number, photographerId: number) {
        
        const folder = await this.folderRepository.getFolderByIdAndUserId(folderId, photographerId);
        if (!folder) {
            throw new Error('Folder not found or not owned by this photographer');
        }
        const images = await this.imageRepository.getImagesFromFolder(folder.id);

        const imageIds: number[] = [];
        images.forEach((image) => {
            imageIds.push(image.id);
        })
        const deletedImages = await this.imageRepository.deleteImageByIds(imageIds);
        const deletedFolder = await this.folderRepository.deleteFolderById(folderId);
        return deletedFolder;
    }

    async getFoldersByPhotographerId(photographerId: number) {
        return this.folderRepository.getFoldersByPhotographerId(photographerId);
    }
}
