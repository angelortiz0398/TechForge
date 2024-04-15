import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray} from '@angular/cdk/drag-drop';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {
  columnSelected: string[];
  columnSelectedBoolean : boolean[];
}

@Component({
  selector: 'app-dialog-selector-column',
  standalone: true,
  imports: [
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    MatCheckboxModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './dialog-selector-column.component.html',
  styleUrl: './dialog-selector-column.component.css'
})
export class DialogSelectorColumnComponent {
  isVisibleColumnControl  = new FormControl<boolean[]>([...this.data.columnSelectedBoolean]);
  options = this._formBuilder.group({
    isVisibleColumn: this.isVisibleColumnControl
  });

  constructor(
    public dialogRef: MatDialogRef<DialogSelectorColumnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private _formBuilder: FormBuilder
  ) {}

  onNoClick(): void {
    this.dialogRef.close(this.data.columnSelected);
  }

  onClick(): void {
    console.log("this.data.columnSelectedBoolean: ", this.data.columnSelectedBoolean);
    var auxColumnSelected : string[] = [];
    this.data.columnSelectedBoolean.forEach((selected:Boolean, index : number)=>{
      if (selected) {
        auxColumnSelected.push(this.data.columnSelected[index]);
      }
    });
    this.dialogRef.close(auxColumnSelected);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.data.columnSelected, event.previousIndex, event.currentIndex);
  }

}
