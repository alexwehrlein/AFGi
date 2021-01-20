import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
  idSucursalDestino:number,
  idPasoProducto:number,
  codigo:string
}

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.css']
})
export class ModalInfoComponent implements OnInit {

  constructor( @Inject(MAT_DIALOG_DATA) public data: DialogData,
  private dialogRef: MatDialog,) { }

  ngOnInit(): void {
  }

}
