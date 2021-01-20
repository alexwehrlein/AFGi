import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { notify } from "../../notificaciones/notify";
import { Router } from "@angular/router";
import { SucursalService } from "../../services/sucursal.service";
import { NgxSpinnerService } from "ngx-spinner";

export interface DialogData {
    idpasoProducto: number;
    fecha: string;
    hora: string;
    idSucursalOri: number;
    nombreOri: string;
    tipo: string;
    productosPP: [];
    seleccionados: any[];
    cantidadSolicitada: any[];
    password: string;
}

@Component({
    selector: "app-model-password",
    templateUrl: "./model-password.component.html",
    styleUrls: ["./model-password.component.css"],
})
export class ModelPasswordComponent implements OnInit {
    token: string;
    constructor(
        private sucursalService: SucursalService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private dialogRef: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
    }

    ValidarPasswork(data: any) {
        this.spinner.show();
        //console.log(data);
        let datos = {
            idpasoProducto: data.idpasoProducto,
            password: data.password,
        };
        this.sucursalService.validarCodigo(datos, this.token).subscribe(
            (res) => {
                //console.log(res);
                if (res.codigo == 5) {
                    this.spinner.hide();
                    notify(res.mensaje, "danger");
                } else if (res.codigo == 0) {
                    this.onClickSolicitud(data);
                }
            },
            (res) => {
                this.spinner.hide();
                if (res.codigo == 3) {
                    notify(res.mensaje, "danger");
                    setTimeout(() => {
                        this.router.navigate(["login"]);
                    }, 1000);
                }
            }
        );
    }

    onClickSolicitud(data: any) {
        //console.log(data);
        let productosPP: any[] = [];

        for (let index = 0; index < data.productosMedicamento.length; index++) {
            if (data.seleccionadosMedicamnetos[index] < 0) {
                notify(
                    "No puede aceptar cantidades negativas del producto: " +
                        data.productosMedicamento[index].codigo,
                    "danger"
                );
                return;
            }

            if (
                data.seleccionadosMedicamnetos[index] > data.cantidadSolicitadaMedicamentos[index]
            ) {
                notify(
                    "No puede aceptar mas de la cantidad solicitada del producto: " +
                        data.productosMedicamento[index].codigo,
                    "danger"
                );
                return;
            }

            if (!Number.isInteger(data.seleccionadosMedicamnetos[index])) {
                notify(
                    "Ingrese una cantidad valida del producto: " +
                        data.productosMedicamento[index].codigo,
                    "danger"
                );
                return;
            }

            productosPP.push({
                codigo: data.productosMedicamento[index].codigo,
                cantidad: data.seleccionadosMedicamnetos[index],
            });
        }

        for (let index = 0; index < data.productosAbarrote.length; index++) {
            if (data.seleccionadosAbarrotes[index] < 0) {
                notify(
                    "No puede aceptar cantidades negativas del producto: " +
                        data.productosAbarrote[index].codigo,
                    "danger"
                );
                return;
            }

            if (data.seleccionadosAbarrotes[index] > data.cantidadSolicitadaAbarrotes[index]) {
                notify(
                    "No puede aceptar mas de la cantidad solicitada del producto: " +
                        data.productosAbarrote[index].codigo,
                    "danger"
                );
                return;
            }

            if (!Number.isInteger(data.seleccionadosAbarrotes[index])) {
                notify(
                    "Ingrese una cantidad valida del producto: " +
                        data.productosAbarrote[index].codigo,
                    "danger"
                );
                return;
            }

            productosPP.push({
                codigo: data.productosAbarrote[index].codigo,
                cantidad: data.seleccionadosAbarrotes[index],
            });
        }

        for (let index = 0; index < data.productosCosmetico.length; index++) {
            if (data.seleccionadosCosmeticos[index] < 0) {
                notify(
                    "No puede aceptar cantidades negativas del producto: " +
                        data.productosCosmetico[index].codigo,
                    "danger"
                );
                return;
            }

            if (data.seleccionadosCosmeticos[index] > data.cantidadSolicitadaCosmeticos[index]) {
                notify(
                    "No puede aceptar mas de la cantidad solicitada del producto: " +
                        data.productosCosmetico[index].codigo,
                    "danger"
                );
                return;
            }

            if (!Number.isInteger(data.seleccionadosCosmeticos[index])) {
                notify(
                    "Ingrese una cantidad valida del producto: " +
                        data.productosCosmetico[index].codigo,
                    "danger"
                );
                return;
            }

            productosPP.push({
                codigo: data.productosCosmetico[index].codigo,
                cantidad: data.seleccionadosCosmeticos[index],
            });
        }

        let item: any = localStorage.getItem("datosUser");
        item = JSON.parse(item);

        let idSucursal: number = item.idSucursal;

        let datos = {
            idpasoProducto: data.idpasoProducto,
            idSucursalDes: idSucursal,
            idSucursalOri: data.idSucursalOri,
            productosPP: productosPP,
        };

        this.sucursalService.actualizarInventario(datos, this.token).subscribe(
            (res) => {
                this.spinner.hide();
                notify("La solicitud del traspaso fue aceptada", "success");
                this.dialogRef.closeAll();
            },
            (res) => {
                this.spinner.hide();
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
