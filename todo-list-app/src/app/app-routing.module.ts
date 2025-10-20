import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./presentation/task/pages/task/task.module').then( m => m.TaskPageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'task',
    loadChildren: () => import('./presentation/task/pages/task/task.module').then( m => m.TaskPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./presentation/categories/pages/categories/categories.module').then( m => m.CategoriesPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
