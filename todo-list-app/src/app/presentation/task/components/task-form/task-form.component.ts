import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskModel } from 'src/app/core/models/task-model.model';
import { v4 as uuid } from 'uuid';
import { IonicModule } from "@ionic/angular";
import { Category } from 'src/app/core/models/category.model';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/core/services/category.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  standalone: false
})
export class TaskFormComponent implements OnInit {
  @Output() create = new EventEmitter<TaskModel>();
  categories$: Observable<Category[]> | undefined;
  showCategoryForm = false;

  title = '';
  description = '';
  categoryId = '';

  constructor(private categoryService: CategoryService,
    private msg: MessageService
  ) { }

  ngOnInit() { 
    this.categories$ = this.categoryService.getCategories();
  }

  onSubmit() {
    if (!this.title.trim()) return;

    const newTask: TaskModel = {
      id: uuid(),
      title: this.title,
      description: this.description,
      categoryId: this.categoryId,
      completed: false,
      createdAt: new Date()
    };

    this.create.emit(newTask);
    this.title = '';
    this.description = '';
    this.categoryId = '';
  }

  toggleCategoryForm() {
    this.showCategoryForm = !this.showCategoryForm;
  }

  async onCreateCategory(category: Category) {
    try {
      await this.categoryService.addCategory(category);
      this.categoryId = category.id;
      this.showCategoryForm = false;
      this.msg.showAlert('Categoría creada', 'Success');
    } catch (error) {
      this.msg.showAlert('Error al crear la categoría', 'Error');
    }
  }
}
