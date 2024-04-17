import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-arrival-page',
  standalone: true,
  imports: [MatGridListModule, MatDividerModule],
  templateUrl: './arrival-page.component.html',
  styleUrl: './arrival-page.component.css'
})
export class ArrivalPageComponent {

}
