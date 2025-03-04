import { BaseRepository } from "repository/base.repository";
import { Document, FilterQuery, UpdateQuery } from "mongoose";

export class BaseService<T extends Document, R extends BaseRepository<T>> {
    protected repository: R;

    constructor(repository: R) {
        this.repository = repository;
    }

    async create(data: Partial<T>): Promise<T> {
        return this.repository.create(data);
    }

    async findById(id: string): Promise<T | null> {
        return this.repository.findById(id);
    }

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        return this.repository.findOne(query);
    }

    async findAll(query: FilterQuery<T> = {}): Promise<T[]> {
        return this.repository.findAll(query);
    }

    async update(id: string, updateData: UpdateQuery<T>): Promise<T | null> {
        return this.repository.update(id, updateData);
    }

    async delete(id: string): Promise<T | null> {
        return this.repository.delete(id);
    }

    async addToSet(id: string, field: string, value: any): Promise<T | null> {
        return this.repository.addToSet(id, field, value);
    }

    async pull(id: string, field: string, value: any): Promise<T | null> {
        return this.repository.pull(id, field, value);
    }
}
