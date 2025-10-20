import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { MessageService } from 'src/app/core/services/message.service';
import { v4 as uuid } from 'uuid';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  standalone: false
})
export class CategoryFormComponent implements OnInit {
  @Output() create = new EventEmitter<Category>();
  @Output() update = new EventEmitter<Category>();
  @Input() categoryToEdit?: Category;

  name = '';
  error = '';

  constructor(private categoryService : CategoryService,
    private msg: MessageService
  ) { }

  ngOnInit() {
    if (this.categoryToEdit) {
    this.name = this.categoryToEdit.name;
  }

   }
  onSubmit() {
    try {
      if (!this.name.trim()) return;

      const exists = this.categoryService.existsByName(this.name, this.categoryToEdit?.id);
      if (exists) {
        this.error = 'Ya existe una categoría con ese nombre';
        return;
      }

      const category: Category = {
        id: this.categoryToEdit?.id ?? uuid(),
        name: this.name
      };

      this.categoryToEdit ? this.update.emit(category) : this.create.emit(category);
      this.categoryToEdit ? this.msg.showAlert('Categoría actualizada', 'Sucess') : this.msg.showAlert('Categoría creada', 'Success');
      this.name = '';
      this.error = '';
    } catch (error) {
      this.msg.showAlert('Error al guardar la categoría', 'Error');
    }
  }
}
