import { Pipe, PipeTransform } from '@angular/core';
import { Category } from 'src/app/core/models/category.model';

@Pipe({
  name: 'categoryName',
  standalone: false
})
export class CategoryNamePipe implements PipeTransform {
  transform(categoryId: string, categories: Category[]): string {
    return categories.find(c => c.id === categoryId)?.name ?? 'Sin categoría';
  }
}
