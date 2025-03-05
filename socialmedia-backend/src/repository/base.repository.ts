import { logger } from "@config/logger";
import { Document, FilterQuery, Model, UpdateQuery } from "mongoose";
import { Logger } from "winston";
export class BaseRepository<T extends Document> {
    logger: Logger
    private model: Model<T>
    constructor(model: Model<T>) {
        this.model = model
        this.logger = logger
    }

    async create(data: Partial<T>): Promise<T> {
        return await this.model.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return await this.model.findById(id).exec();
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return await this.model.findOne(query).exec();
    }

    async findAll(query: FilterQuery<T> = {}): Promise<T[]> {
        return await this.model.find(query).exec();
    }

    async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    }

    async delete(id: string): Promise<T | null> {
        return await this.model.findByIdAndDelete(id).exec();
    }

    async addToSet(id: string, field: string, value: any): Promise<T | null> {
        const updatedDocument = await this.model.findByIdAndUpdate(
            id,
            { $addToSet: { [field]: value } } as UpdateQuery<T>,
            { new: true }
        );
        return updatedDocument as unknown as T | null;
    }
    async pull(id: string, field: string, value: any): Promise<T | null> {
        const updatedDocument = await this.model.findByIdAndUpdate(
            id,
            { $pull: { [field]: value } } as UpdateQuery<T>,
            { new: true }
        );
        return updatedDocument as unknown as T | null;
    }
    async incrementField(id: string, field: string): Promise<T | null> {
        const updatedDocument = await this.model.findByIdAndUpdate(
            id,
            { $inc: { [field]: 1 } } as UpdateQuery<T>,
            { new: true }
        );
        return updatedDocument as unknown as T | null;
    }

    async decrementField(id: string, field: string): Promise<T | null> {
        const updatedDocument = await this.model.findByIdAndUpdate(
            id,
            { $inc: { [field]: -1 } } as UpdateQuery<T>,
            { new: true }
        );
        return updatedDocument as unknown as T | null;
    }

}