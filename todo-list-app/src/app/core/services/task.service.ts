import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TaskModel } from '../models/task-model.model';
import { StorageService } from './storage.service';


@Injectable({
    providedIn: 'root'
})

export class TaskService {

    private tasks$ = new BehaviorSubject<TaskModel[]>([]);
    private readonly STORAGE_KEY = 'tasks';
    constructor(private storage: StorageService) {
        this.init();
    }

    public async init(): Promise<void> {
        await this.storage.init(); 
        await this.loadTasks();  
    }

    async loadTasks(): Promise<void> {
        const stored = await this.storage.get<TaskModel[]>(this.STORAGE_KEY);
        this.tasks$.next(stored || []);
    }

    getTasks(page: number = 0, pageSize: number = 10): Observable<TaskModel[]> {
        return this.tasks$.asObservable().pipe(
            map(tasks => {
                const start = page * pageSize;
                return tasks.slice(start, start + pageSize);
            })
        );
    }


    async addTask(task: TaskModel): Promise<void> {
        const current = this.tasks$.getValue();
        const updated = [...current, task];
        await this.storage.set(this.STORAGE_KEY, updated);
        this.tasks$.next(updated);
    }

    async deleteTask(id: string): Promise<void> {
        const updated = this.tasks$.getValue().filter(t => t.id !== id);
        await this.storage.set(this.STORAGE_KEY, updated);
        this.tasks$.next(updated);
    }

    async completeTask(id: string): Promise<void> {
        const updated = this.tasks$.getValue().map(t =>
            t.id === id ? { ...t, completed: true } : t
        );
        await this.storage.set(this.STORAGE_KEY, updated);
        this.tasks$.next(updated);
    }

    filterByCategory(categoryId: string): Observable<TaskModel[]> {
        return this.getTasks().pipe(
            map((tasks: TaskModel[]) => tasks.filter(t => t.categoryId === categoryId))
        );
    }
    
    getpaginated(page: number, pageSize: number): TaskModel[] {
        const all = this.tasks$.getValue();
        const start = page * pageSize;
        return all.slice(start, start + pageSize);
    }

    getTasksSync(): TaskModel[] {
        return this.tasks$.getValue();
    }
}

