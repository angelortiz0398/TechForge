import { Component, Inject } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { DialogData } from '../dialog-selector-column/dialog-selector-column.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-donations',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose],
  templateUrl: './dialog-donations.component.html',
  styleUrl: './dialog-donations.component.css'
})
export class DialogDonationsComponent {
  constructor(
    public dialogRef: MatDialogRef<FooterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
