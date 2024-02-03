import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mat-dialog',
  templateUrl: './mat-dialog.component.html',
  styleUrls: ['./mat-dialog.component.css']
})
export class MatDialogComponent {
  message: string = "Are you sure?"
  confirmButtonText = "Yes"
  cancelButtonText = "Cancel"
  placeholderText:string = "";
  canBindInput:boolean=false;
  title:string='';
  label:string=''
  constructor(private dialogRef: MatDialogRef<MatDialogComponent>, @Inject(MAT_DIALOG_DATA) public modalData: any) {
    if(modalData){
    this.message = modalData.message || this.message;
    this.placeholderText=modalData.placeholderText || this.placeholderText;
    this.canBindInput=modalData.canBindInput||this.canBindInput;
    this.title=modalData.title||this.title;
    this.label=modalData.label||this.label;

    if (modalData.buttonText) {
      this.confirmButtonText = modalData.buttonText.ok || this.confirmButtonText;
      this.cancelButtonText = modalData.buttonText.cancel || this.cancelButtonText;
    }
    }
  }
  onConfirmClick(): void {
    this.dialogRef.close(this.modalData);
  }

}
