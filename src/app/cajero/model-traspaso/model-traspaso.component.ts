import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { notify } from "../../notificaciones/notify";
import { Router } from "@angular/router";
import { SucursalService } from "../../services/sucursal.service";

export interface DialogData {
    codigo: string;
    cantidad: number;
    idSucursalDes: number;
    index: number;
    idSucursalOri: number;
    nombreOri: string;
}

@Component({
    selector: "app-model-traspaso",
    templateUrl: "./model-traspaso.component.html",
    styleUrls: ["./model-traspaso.component.css"],
})
export class ModelTraspasoComponent implements OnInit {
    token: string;
    constructor(
        private sucursalService: SucursalService,
        private router: Router,
        public dialogRef: MatDialogRef<ModelTraspasoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
    }

    editar(data: any) {
        let pedidoSucursal: any = localStorage.getItem("pedidoSucursal");
        pedidoSucursal = JSON.parse(pedidoSucursal);
        pedidoSucursal[data.index].cantidad = data.cantidad;
        localStorage.setItem("pedidoSucursal", JSON.stringify(pedidoSucursal));
        this.dialogRef.close();
    }

    onClick(data: any) {
        //console.log(data);
        let datos = {
            idSucursal: data.idSucursalOri,
            codigo: data.codigo,
            cantidad: data.cantidad,
        };
        //console.log(datos);
        this.sucursalService.validarExistencia(datos, this.token).subscribe(
            (res) => {
                let pedidoSucursal: any = localStorage.getItem("pedidoSucursal");
                pedidoSucursal = JSON.parse(pedidoSucursal);
                if (pedidoSucursal == null || pedidoSucursal == "null") {
                    pedidoSucursal = [];
                }

                let productoSearch = pedidoSucursal.filter(
                    (traspaso) => traspaso.codigo === data.codigo
                );

                if (productoSearch.length > 0) {
                    notify("Este producto ya esta agregado.", "danger");
                    return;
                }
                pedidoSucursal.push({
                    codigo: data.codigo,
                    cantidad: data.cantidad,
                });

                localStorage.setItem("pedidoSucursal", JSON.stringify(pedidoSucursal));
                this.dialogRef.close();
            },
            (res) => {
                if (res.codigo == 5) {
                    notify(res.mensaje, "danger");
                }
                if (res.codigo == 3) {
                    notify(res.mensaje, "danger");
                    setTimeout(() => {
                        this.router.navigate(["login"]);
                    }, 1000);
                }
            }
        );
    }
}
