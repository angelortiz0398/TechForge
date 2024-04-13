import { Component, Input, OnInit } from '@angular/core';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [MatProgressBarModule, MatCardModule, MatDividerModule],
  templateUrl: './progress.component.html',
  styleUrl: './progress.component.css'
})
export class ProgressComponent implements OnInit {
  @Input() progress = 0;
  @Input() loading: boolean = true;
  constructor() {}

  ngOnInit() {}
}

