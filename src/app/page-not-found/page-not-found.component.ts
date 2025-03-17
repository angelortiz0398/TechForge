import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-page-not-found',
    imports: [RouterOutlet],
    templateUrl: './page-not-found.component.html',
    styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  private route!: ActivatedRoute;
}
