import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { TaskModel } from 'src/app/core/models/task-model.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { MessageService } from 'src/app/core/services/message.service';
import { TaskService } from 'src/app/core/services/task.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false
})
export class TaskPage implements OnInit {
  tasks$: Observable<TaskModel[]> | undefined;
  categories$: Observable<Category[]> | undefined;
  showForm = false;
  selectedCategoryId = '';

  page = 0;
  pageSize = 8;
  tasks: TaskModel[] = [];
  totalTasks = 0;
  totalPages = 0;

  constructor(private taskService: TaskService,
    private categoryService: CategoryService,
    private msg: MessageService
  ) { }

  async ngOnInit() {
    this.categories$ = this.categoryService.getCategories();
    await this.taskService.init();
    this.loadPage();
    this.loadTasks();
  }

  async onCreate(task: TaskModel) {
    try {
      await this.taskService.addTask(task);
      this.showForm = false;
      this.msg.showAlert('Tarea creada', 'Success');
      this.loadPage();
    } catch (error) {
      this.msg.showAlert('Error al crear la tarea', 'Error');
    }
  }

  async onComplete(id: string) {
    await this.taskService.completeTask(id);
    this.msg.showAlert('Tarea completada', 'Success');
  }

  async onDelete(id: string) {
    try {
      await this.taskService.deleteTask(id);
      this.msg.showAlert('Tarea eliminada', 'Success');
    } catch (error) {
      this.msg.showAlert('Error al eliminar la tarea', 'Error');
    }
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  loadTasks() {
    this.tasks$ = this.selectedCategoryId
      ? this.taskService.filterByCategory(this.selectedCategoryId)
      : this.taskService.getTasks();
  }

  onCategoryChange(id: string) {
    this.selectedCategoryId = id;
    this.loadTasks();
  }

  loadPage() {
    const all =  this.taskService.getTasksSync();
    this.totalTasks = all.length;
    this.totalPages = Math.ceil(this.totalTasks / this.pageSize);
    this.tasks$ = this.taskService.getTasks(this.page, this.pageSize);
  }

  loadNextPage() {
    if (this.hasNextPage()) {
      this.page++;
      this.loadPage();
    }
  }

  loadPreviousPage() {
    if (this.page > 0) {
      this.page--;
      this.loadPage();
    }
  }

   hasNextPage(): boolean {
    const all = this.taskService.getTasksSync();
    return (this.page + 1) * this.pageSize < all.length;
  }

  trackById(index: number, item: TaskModel): string {
    return item.id;
  }

}
