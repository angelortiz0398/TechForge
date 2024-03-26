import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogDonationsComponent } from '../dialog-donations/dialog-donations.component';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  constructor(public dialog: MatDialog) {}
  CargarDonaciones(): void{
    const dialogRef = this.dialog.open(DialogDonationsComponent, {
      disableClose: true,
      width: '400px',
      height: '700px',
      data: {
      },
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
