import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ProductoService } from "app/services/producto.service";
import { notify } from "../../notificaciones/notify";

export interface DialogData {
  precioCompra: number;
  precioVenta: number;
  codigo: string;
}

@Component({
  selector: "app-modal-precio-producto",
  templateUrl: "./modal-precio-producto.component.html",
  styleUrls: ["./modal-precio-producto.component.css"],
})
export class ModalPrecioProductoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalPrecioProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private productoService: ProductoService,
    private router: Router
  ) {}

  token: string;

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
    if (this.token == null) {
      this.router.navigate(["login"]);
    }
  }

  onClick(data: DialogData): void {
    if (data.precioVenta == undefined) {
      notify("Ingresar el nuevo precio de compra.", "danger");
      return;
    }

    if (isNaN(data.precioVenta)) {
      notify("Ups... " + data.precioVenta + " no es un nùmero.", "danger");
      return;
    }

    this.productoService.actualizarPrecioProducto(data, this.token).subscribe(
      (res) => {
        if(res.codigo == "0"){
          notify(res.mensaje,"success");
          this.dialogRef.close();
        }else if(res.codigo == "5" ){
          notify(res.mensaje + " . ULTIMO PRECIO DE COMPRA: $"+data.precioCompra,"danger");
        }else if(res.codigo == "500" ){
          notify(res.mensaje,"danger");
        }
      },
      (res) => {
        if (res.codigo == 3) {
          notify(res.mensaje, "danger");
          setTimeout(() => {
            this.router.navigate(["login"]);
          }, 1000);
        }
      }
    );
  }

validarNumero(event){
    var out = '';
    var filtro = '1234567890';
    
    for (var i=0; i<event.target.value.length; i++)
       if (filtro.indexOf(event.target.value.charAt(i)) != -1) 
             
          out += event.target.value.charAt(i);
    
      event.target.value = out;
}
}
