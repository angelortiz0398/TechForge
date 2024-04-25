import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { FooterComponent } from './footer/footer.component';
import { DropfileDirective } from './Dropfile.directive';
import { ProgressComponent } from './progress/progress.component';



@NgModule({
  declarations: [
   ],
  imports: [
    MatSlideToggleModule,
    CommonModule,
    MainLayoutComponent,
    FooterComponent,
    ProgressComponent,
    DropfileDirective
  ],
  exports:[
    DropfileDirective
  ]
})
export class HomepageModule { }
