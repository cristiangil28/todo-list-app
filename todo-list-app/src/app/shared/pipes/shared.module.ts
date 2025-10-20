import { CommonModule } from "@angular/common";
import { CategoryNamePipe } from "./catergory-name-pipe";
import { NgModule } from "@angular/core";

@NgModule({
  declarations: [CategoryNamePipe],
  exports: [CategoryNamePipe],
  imports: [CommonModule]
})
export class SharedModule {}
