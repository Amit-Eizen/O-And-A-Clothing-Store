import {Request, Response} from "express";
import BaseService from "../services/baseService";

class BaseController {
    service: BaseService;

    constructor(service: BaseService) {
        this.service = service;
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            if(req.query) {
                const filteredData = await this.service.getAll(req.query);
                res.status(200).json(filteredData);
            }
            else {
                const data = await this.service.getAll();
                res.status(200).json(data);
            }
        } catch (error) {
            res.status(500).json({error: "Error retrieving data"});
        }
    };

    async getById(req: Request, res: Response): Promise<void> {
        const id = String(req.params.id);
        try {
            const data = await this.service.getById(id);
            if (!data) {
                res.status(404).json({error: "Item not found"});
                return;
            } else {
                res.status(200).json(data);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Error retrieving item by ID"});
        }
    };

    async create(req: Request, res: Response): Promise<void> {
        const data = req.body;
        console.log("Creating item with data:", data);
        try {
            const newItem = await this.service.create(data);
            res.status(201).json(newItem);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Error creating item"});
        }
    };

    async update(req: Request, res: Response): Promise<void> {
        const id = String(req.params.id);
        const updatedData = req.body;
        try {
            const data = await this.service.update(id, updatedData);
            if (!data) {
                res.status(404).json({error: "Item not found"});
                return;
            } else {
                res.status(200).json(data);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Error updating item"});
        }
    };

    async delete(req: Request, res: Response): Promise<void> {
        const id = String(req.params.id);
        try {
            const deletedData = await this.service.delete(id);
            if (!deletedData) {
                res.status(404).json({error: "Item not found"});
                return;
            } else {
                res.status(200).json({message: "Item deleted successfully"});
                console.log("Deleted item:", deletedData);
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({error: "Error deleting item"});
        }
    };
};
export {BaseController};