import { TaskFormComponent } from './../../components/task-form/task-form.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaskPageRoutingModule } from './task-routing.module';

import { TaskPage } from './task.page';
import { CategoriesPageModule } from 'src/app/presentation/categories/pages/categories/categories.module';
import { SharedModule } from 'src/app/shared/pipes/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TaskPageRoutingModule,
    CategoriesPageModule,
    SharedModule
  ],
  declarations: [TaskPage, TaskFormComponent]
})
export class TaskPageModule {}
