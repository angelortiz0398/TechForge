import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageModule } from './homepage/homepage.module';
import { MainLayoutComponent } from './homepage/main-layout/main-layout.component';
import { FooterComponent } from './homepage/footer/footer.component';
import { DropfileDirective } from './homepage/Dropfile.directive';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, RouterOutlet, HomepageModule, MainLayoutComponent, FooterComponent, MatSidenavModule,MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [DropfileDirective]
})
export class AppComponent {
  title = 'TechForge';
  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
}
