export interface TaskModel {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    categoryId: string;
    createdAt: Date;
    updatedAt?: Date;
}
