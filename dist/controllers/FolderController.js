import { FolderService } from '../services/FolderService.js';
export class FolderController {
    folderService;
    constructor() {
        this.folderService = new FolderService();
    }
    async createFolder(req, res) {
        const { name } = req.body;
        const { location } = req.body;
        // @ts-ignore
        const photographerId = req.user.id;
        try {
            const newFolder = await this.folderService.createFolder(name, location, photographerId);
            return res.status(201).json(newFolder);
        }
        catch (err) {
            return res.status(500).json({ error: err });
        }
    }
    async deleteFolderById(req, res) {
        const folderId = parseInt(req.params.id);
        // @ts-ignore
        const photographerId = req.user.id;
        try {
            const deletedFolder = await this.folderService.deleteFolderById(folderId, photographerId);
            return res.status(200).json(deletedFolder);
        }
        catch (err) {
            return res.status(404).json({ error: 'Folder not found or not owned by this photographer' });
        }
    }
    async getFolders(req, res) {
        // @ts-ignore
        const photographerId = req.user.id;
        try {
            const folders = await this.folderService.getFoldersByPhotographerId(photographerId);
            return res.status(200).json(folders);
        }
        catch (err) {
            return res.status(500).json({ error: err });
        }
    }
}
//# sourceMappingURL=FolderController.js.map