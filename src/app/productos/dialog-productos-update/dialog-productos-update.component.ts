import { Component, OnInit, Inject } from "@angular/core";
import {
     MatDialog,
     MatDialogRef,
     MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { notify } from "../../notificaciones/notify";
import { ProductoService } from "../../services/producto.service";

export interface DialogData {
     codigo: string;
     descripcion: string;
     marcaComercial: string;
     sustancia: string;
     laboratorio: string;
     tipoMedicamento: string;
     nombre: string;
     marca: string;
     precio: number;
     existencia: number;
}

@Component({
     selector: "app-dialog-productos-update",
     templateUrl: "./dialog-productos-update.component.html",
     styleUrls: ["./dialog-productos-update.component.css"]
})
export class DialogProductosUpdateComponent implements OnInit {
     codigo: string;
     token: string;
     tipoMedicamento: string;
     constructor(
          private productoInyectable: ProductoService,
          public dialogRef: MatDialogRef<DialogProductosUpdateComponent>,
          @Inject(MAT_DIALOG_DATA) public data: DialogData
     ) {}

     ngOnInit(): void {
          this.token = localStorage.getItem("token");
          this.tipoMedicamento = localStorage.getItem("updateProductoTipo");
     }

     onClick(data: DialogData): void {
          this.codigo = data.codigo;

          delete data.precio;
          delete data.existencia;
          delete data.codigo;

          //console.log(data);

          if (this.tipoMedicamento == "medicamento") {
            if (data.marcaComercial == "") {
                notify(
                    "Ingresar la marca comercial del medicamento.",
                    "danger"
                );
                return;
            }
            if (data.laboratorio == "") {
                notify("Ingresar el laboratio del medicamento.", "danger");
                return;
            }
            if (data.sustancia == "") {
                notify("Ingresar la sustancia del medicamento.", "danger");
                return;
            }
            if (data.tipoMedicamento == "") {
                notify("Seleccionar tipo de medicamento.", "danger");
                return;
            }
            if (data.descripcion == "") {
                notify("Ingresar la descripción del producto.", "danger");
                return;
            }
        }

        if (this.tipoMedicamento == "abarrote") {
            if (data.marca == "") {
                notify("Ingresar la marca del producto.", "danger");
                return;
            }
            if (data.nombre == "") {
                notify("Ingresar nombre del producto.", "danger");
                return;
            }
            if (data.descripcion == "") {
              notify("Ingresar la descripción del producto.", "danger");
              return;
          }
        }

        if (this.tipoMedicamento == "cosmetico") {
            if (data.marca == "") {
                notify("Ingresar la marca del producto.", "danger");
                return;
            }
            if (data.nombre == "") {
                notify("Ingresar nombre del producto.", "danger");
                return;
            }
            if (data.laboratorio == "") {
                notify("Ingresar el laboratio del cosmetico.", "danger");
                return;
            }
            if (data.descripcion == "") {
              notify("Ingresar la descripción del producto.", "danger");
              return;
          }
        }

          this.productoInyectable
               .actualizarProducto(
                    data,
                    this.token,
                    this.tipoMedicamento,
                    this.codigo
               )
               .subscribe(
                    (res) => {
                         notify(
                              "El producto fue actualizado exitosamente",
                              "success"
                         );
                    },
                    (res) => {
                         if (res.codigo == 3) {
                              notify(res.mensaje, "danger");
                              return;
                         }
                    }
               );
          this.dialogRef.close();
     }
}
