import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Card } from 'src/app/models/card';
import { CardService } from 'src/app/services/card.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss'],
})
export class CardModalComponent implements OnInit {
  cardForm!: FormGroup;

  showSpinner: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<CardModalComponent>,
    private fb: FormBuilder,
    private cardService: CardService,
    private _snackBar: MatSnackBar,
    private snackBarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: Card

  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.cardForm = this.fb.group({
      name: [this.data?.name || '', Validators.maxLength(50)],
      title: [
        this.data?.title || '',
        [Validators.required, Validators.maxLength(255)],
      ], // giriş zorunlu
      phone: [
        this.data?.phone || '',
        [Validators.required, Validators.maxLength(20)],
      ],
      email: [
        this.data?.email || '',
        [Validators.email, Validators.maxLength(50)],
      ],
      address: [this.data?.address || '', Validators.maxLength(255)],
    });
  }

  addCard(): void {
    this.showSpinner = true;
    this.cardService.addCard(this.cardForm.value).subscribe((res: any) => {
      this.getSuccess(res || 'Kartvizit başarıyla eklendi.')
    },
    (err:any)=>{
      this.getError(err.message || 'kartvizit eklenirken bir sorun olustu.')
    });
  }

  updateCard(): void {
    this.showSpinner = true;
    this.cardService.updateCard(this.cardForm.value, this.data.id).subscribe((res: any) => {
      this.getSuccess(res || 'Kartvizit başarıyla güncellendi.')
      },
      (err:any)=>{
        this.getError(err.message || 'kartvizit guncellenirken bir sorun olustu.')
    });
  }

  deleteCard(): void {
    this.showSpinner = true;
    this.cardService.deleteCard(this.data.id).subscribe((res:any) => {
      this.getSuccess(res || 'Kartvizit başarıyla silindi.')
    },
    (err:any)=>{
      this.getError(err.message || 'kartvizit silinirken bir sorun olustu.')
  });
  }

  getSuccess(message:string): void {
    this.snackBarService.createSnacbar(message);
    this.cardService.getCards();
    this.showSpinner=false;
    this.dialogRef.close()
  }

  getError(message : string): void {
    this.snackBarService.createSnacbar(message);
    this.showSpinner=false; 

  }

}