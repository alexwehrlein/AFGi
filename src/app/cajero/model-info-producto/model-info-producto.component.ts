import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Producto } from "app/models/producto";
import { notify } from "../../notificaciones/notify";

export interface DialogData {
  productos: Producto[]
}

@Component({
  selector: 'app-model-info-producto',
  templateUrl: './model-info-producto.component.html',
  styleUrls: ['./model-info-producto.component.css']
})
export class ModelInfoProductoComponent implements OnInit {

  art: Producto = new Producto();

  constructor(
    private dialogRef: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit(): void {
    console.log(this.data);
  }

  buscarProductos(ev){
    this.art = this.data.productos.find((res) => res.codigo == ev.value);
    if(Object.keys(this.art).length == 0){
      this.art = new Producto();
    }
    ev.value = "";
    document.getElementById("searchProductoInfo").focus();
  }

}
