import {Model} from "mongoose";

class BaseService {
    model: Model<any>;

    constructor(model: Model<any>) {
        this.model = model;
    }

    async getAll(filters: any = {}): Promise<any[]> {
        return this.model.find(filters);
    }

    async getById(id: string): Promise<any | null> {
        return this.model.findById(id);
    }

    async create(data: any): Promise<any> {
        return this.model.create(data);
    }

    async update(id: string, updatedData: any): Promise<any | null> {
        return this.model.findByIdAndUpdate(id, updatedData, {new: true});
    }

    async delete(id: string): Promise<any | null> {
        return this.model.findByIdAndDelete(id);
    }
}

export default BaseService;