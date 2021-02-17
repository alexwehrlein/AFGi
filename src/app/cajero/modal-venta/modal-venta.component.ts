import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { notify } from "app/notificaciones/notify";

export interface DialogData {
  total: number;
}

@Component({
  selector: "app-modal-venta",
  templateUrl: "./modal-venta.component.html",
  styleUrls: ["./modal-venta.component.css"],
})
export class ModalVentaComponent implements OnInit {
  token: string;
  importe: number;
  cambio: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ModalVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
  }

  cambioDevolver(event) { 
    var out = '';
    var filtro = '1234567890.';
	
    for (var i=0; i<event.target.value.length; i++)
       if (filtro.indexOf(event.target.value.charAt(i)) != -1) 
             
	      out += event.target.value.charAt(i);
	
      event.target.value = out;

    if (!isNaN(this.importe)) {
      let dinero = this.importe - this.data.total;
      if (dinero > 0) {
        this.cambio = dinero;
      }else{
        this.cambio = 0
      }
    }
  }

  venta() {
    if (this.importe < this.data.total) {
      notify("Ingrese un importe mayor o igual que el total.", "danger");
      return;
    }
    this.dialogRef.close({ data: false , cambio:this.cambio , importe:this.importe});
  }
}
