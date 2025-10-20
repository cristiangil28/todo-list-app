import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from 'src/app/core/services/category.service';
import { MessageService } from 'src/app/core/services/message.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false
})
export class CategoriesPage implements OnInit {
  categories$: Observable<Category[]> | undefined;
  categoryToEdit?: Category;

  showForm = false;
  page = 0;
  pageSize = 10;
  categories: Category[] = [];
  totalCategories = 0;
  totalPages = 0;


  constructor(private categoryService: CategoryService,
    private msg: MessageService
  ) { }

  async ngOnInit() {
    await this.categoryService.init();
    this.loadPage();
  }

  async onCreate(category: Category) {
    await this.categoryService.addCategory(category);
    this.showForm = false;
    this.loadPage();
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  onEdit(category: Category) {
    this.categoryToEdit = category;
    this.showForm = true;
  }

  async onUpdate(category: Category) {
    await this.categoryService.updateCategory(category);
    this.showForm = false;
    this.categoryToEdit = undefined;
    this.loadPage();
  }

  async onDelete(id: string) {
    try {
      await this.categoryService.deleteCategory(id);
      this.msg.showAlert('Categoría eliminada', 'Success');
      this.loadPage();
    } catch (error) {
      this.msg.showAlert('Error al eliminar la categoría', 'Error');
    }
  }

  loadPage() {
    const all =  this.categoryService.getCategoriesSync();
    this.totalCategories = all.length;
    this.totalPages = Math.ceil(this.totalCategories / this.pageSize);
    this.categories$ = this.categoryService.getCategories(this.page, this.pageSize);
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
    const all = this.categoryService.getCategoriesSync();
    return (this.page + 1) * this.pageSize < all.length;
  }

  trackById(index: number, item: Category): string {
    return item.id;
  }
}
