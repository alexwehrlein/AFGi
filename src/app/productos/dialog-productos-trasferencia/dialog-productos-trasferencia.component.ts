import { Component, OnInit, Inject } from "@angular/core";
import { Sucursal } from "../../models/sucursal";
import { notify } from "../../notificaciones/notify";
import { FormGroup } from "@angular/forms";
import { UsuarioService } from "../../services/usuario.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

export interface DialogData {
    existencias: number;
    cantidad: any[];
    codigo: string;
    nombre: string;
    index: number;
    status: number;
}

@Component({
    selector: "app-dialog-productos-trasferencia",
    templateUrl: "./dialog-productos-trasferencia.component.html",
    styleUrls: ["./dialog-productos-trasferencia.component.css"],
})
export class DialogProductosTrasferenciaComponent implements OnInit {
    token: string;
    sucurdales: Array<Sucursal> = new Array<Sucursal>();
    formularioTraspaso: FormGroup;

    constructor(
        private sucursalInyectable: UsuarioService,
        public dialogRef: MatDialogRef<DialogProductosTrasferenciaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");

        this.sucursalInyectable.octenerSucursales(this.token).subscribe((sucursales) => {
            this.sucurdales = sucursales;
        });
    }

    onClickEditar(data: DialogData): void {
        let listaTraspaso: any = localStorage.getItem("listaTraspasoServis");
        let listaTraspasoCompleto: any = localStorage.getItem("listaTraspaso");

        let sucursalesCantidad: any[] = [];

        listaTraspaso = JSON.parse(listaTraspaso);
        listaTraspasoCompleto = JSON.parse(listaTraspasoCompleto);

        let traspaso = data.cantidad.reduce((a, b) => a + b, 0);

        if (traspaso > data.existencias) {
            notify("Solo cuentas con " + data.existencias + " existencias.", "danger");
            return;
        }

        this.sucurdales.map((sucursal, index) => {
            sucursalesCantidad.push({
                nombre: sucursal.nombre,
                cantidad: data.cantidad[index],
            });
        });

        listaTraspasoCompleto[data.index].cantidad = sucursalesCantidad;
        listaTraspasoCompleto[data.index].pedido = data.cantidad;

        localStorage.setItem("listaTraspaso", JSON.stringify(listaTraspasoCompleto));

        listaTraspaso.map((item, index) => {
            item.productosPP.map((producto, i) => {
                if (producto.codigo == data.codigo) {
                    producto.cantidad = data.cantidad[index];
                }
            });
        });

        localStorage.setItem("listaTraspasoServis", JSON.stringify(listaTraspaso));

        this.dialogRef.close();
    }

    onClick(data: DialogData): void {
        console.log(data);

        let listaTraspaso: any = localStorage.getItem("listaTraspasoServis");
        let listaTraspasoCompleto: any = localStorage.getItem("listaTraspaso");
        let sucursalesCantidad: any[] = [];
        listaTraspaso = JSON.parse(listaTraspaso);
        listaTraspasoCompleto = JSON.parse(listaTraspasoCompleto);

        if (listaTraspaso == null || listaTraspaso == "null") {
            listaTraspaso = [];
        }
        if (listaTraspasoCompleto == null || listaTraspasoCompleto == "null") {
            listaTraspasoCompleto = [];
        }

        let traspaso = data.cantidad.reduce((a, b) => a + b, 0);

        if (traspaso > data.existencias) {
            notify("Solo cuentas con " + data.existencias + " existencias.", "danger");
            return;
        }

        let productoSearch = listaTraspasoCompleto.filter(
            (traspaso) => traspaso.codigo === data.codigo
        );

        if (productoSearch.length > 0) {
            notify("Este producto ya esta repartido.", "danger");
            return;
        }

        this.sucurdales.map((sucursal, index) => {
            sucursalesCantidad.push({
                nombre: sucursal.nombre,
                cantidad: data.cantidad[index],
            });
        });

        listaTraspasoCompleto.push({
            codigo: data.codigo,
            nombre: data.nombre,
            existencias: data.existencias,
            pedido: data.cantidad,
            cantidad: sucursalesCantidad,
        });

        localStorage.setItem("listaTraspaso", JSON.stringify(listaTraspasoCompleto));

        this.sucurdales.map((sucursal, index) => {
            if (listaTraspaso.length == 0) {
                listaTraspaso.push({
                    idSucursalDes: sucursal.idSucursal,
                    productosPP: [
                        {
                            codigo: data.codigo,
                            cantidad: data.cantidad[index],
                        },
                    ],
                });
            } else {
                let encontroSucursal = -1;
                listaTraspaso.map((lista, index) => {
                    if (lista.idSucursalDes == sucursal.idSucursal) {
                        encontroSucursal = index;
                    }
                });

                if (encontroSucursal === -1) {
                    listaTraspaso.push({
                        idSucursalDes: sucursal.idSucursal,
                        productosPP: [
                            {
                                codigo: data.codigo,
                                cantidad: data.cantidad[index],
                            },
                        ],
                    });
                } else {
                    listaTraspaso[encontroSucursal].productosPP.push({
                        codigo: data.codigo,
                        cantidad: data.cantidad[index],
                    });
                }
            }
        });

        localStorage.setItem("listaTraspasoServis", JSON.stringify(listaTraspaso));

        this.dialogRef.close();
    }
}
