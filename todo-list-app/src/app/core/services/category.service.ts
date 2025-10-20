import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { Category } from "../models/category.model";
import { StorageService } from "./storage.service";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private categories$ = new BehaviorSubject<Category[]>([]);
    private readonly STORAGE_KEY = 'categories';

    constructor(private storage: StorageService) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.storage.init();
        await this.loadCategories();
    }


    async loadCategories(): Promise<void> {
        const stored = await this.storage.get<Category[]>(this.STORAGE_KEY);
        this.categories$.next(stored || []);
    }

    getCategories(page: number = 0, pageSize: number = 10): Observable<Category[]> {
    return this.categories$.asObservable().pipe(
        map(categories => {
            const start = page * pageSize;
            return categories.slice(start, start + pageSize);
        })
    );
}

    async addCategory(category: Category): Promise<void> {
        const current = this.categories$.getValue();
        const updated = [...current, category];
        await this.storage.set(this.STORAGE_KEY, updated);
        this.categories$.next(updated);
    }

    async deleteCategory(id: string): Promise<void> {
        const updated = this.categories$.getValue().filter(c => c.id !== id);
        await this.storage.set(this.STORAGE_KEY, updated);
        this.categories$.next(updated);
    }

    async updateCategory(updated: Category): Promise<void> {
        const current = this.categories$.getValue();
        const index = current.findIndex(c => c.id === updated.id);
        if (index === -1) return;

        current[index] = updated;
        await this.storage.set(this.STORAGE_KEY, current);
        this.categories$.next([...current]);
    }

    async getCategoryById(id: string): Promise<Category | undefined> {
        const current = this.categories$.getValue();
        return current.find(c => c.id === id);
    }

    existsByName(name: string, excludeId?: string): boolean {
        const categories = this.categories$.getValue();
        return categories.some(c =>
            c.name.trim().toLowerCase() === name.trim().toLowerCase() &&
            c.id !== excludeId
        );
    }

    getPaginated(page: number, pageSize: number): Category[] {
        const all = this.categories$.getValue();
        const start = page * pageSize;
        return all.slice(start, start + pageSize);
    }

    getCategoriesSync(): Category[] {
        return this.categories$.getValue();
    }
}
