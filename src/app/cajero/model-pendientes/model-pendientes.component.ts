import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { notify } from "../../notificaciones/notify";
import { SucursalService } from "../../services/sucursal.service";
import { Router } from "@angular/router";
import { ModelPasswordComponent } from "../model-password/model-password.component";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

export interface DialogData {
    idpasoProducto: number;
    fecha: string;
    hora: string;
    idSucursalOri: number;
    nombreOri: string;
    tipo: string;
    productosMedicamento: [];
    productosAbarrote: [];
    productosCosmetico: [];
    band: [];
    seleccionadosMedicamnetos: any[];
    seleccionadosAbarrotes: any[];
    seleccionadosCosmeticos: any[];
    cantidadSolicitadaMedicamentos: any[];
    cantidadSolicitadaAbarrotes: any[];
    cantidadSolicitadaCosmeticos: any[];
}

@Component({
    selector: "app-model-pendientes",
    templateUrl: "./model-pendientes.component.html",
    styleUrls: ["./model-pendientes.component.css"],
})


export class ModelPendientesComponent implements OnInit {

    @ViewChild("matPaginatorMedicamento", { read: MatPaginator })paginatorMedicamento: MatPaginator;
    @ViewChild("matPaginatorAbarrotes", { read: MatPaginator }) paginatorAbarrotes: MatPaginator;
    @ViewChild("matPaginatorCosmeticos", { read: MatPaginator }) paginatorCosmeticos: MatPaginator;

    productosRechazados: any[] = [];
    dataSourceMedicamento = new MatTableDataSource<any>();
    dataSourceAbarrotes = new MatTableDataSource<any>();
    dataSourceCosmeticos = new MatTableDataSource<any>();
    token: string;
    constructor(
        private spinner: NgxSpinnerService,
        private router: Router,
        public dialog: MatDialog,
        private sucursalService: SucursalService,
        public dialogRef: MatDialogRef<ModelPendientesComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    productosMedicamento: string[] = [
        "codigo",
        "marcaComercial",
        "descripcion",
        "sustancia",
        "cantidad",
        "opciones",
    ];
    productosMedicamentoSolicitud: string[] = [
        "codigo",
        "marcaComercial",
        "descripcion",
        "sustancia",
        "cantidad",
    ];
    productosAbarrote: string[] = [
        "codigo",
        "nombre",
        "descripcion",
        "marca",
        "cantidad",
        "opciones",
    ];
    productosAbarroteSolicitud: string[] = ["codigo", "nombre", "descripcion", "marca", "cantidad"];
    productosCosmetico: string[] = [
        "codigo",
        "nombre",
        "descripcion",
        "marca",
        "cantidad",
        "opciones",
    ];
    productosCosmeticoSolitud: string[] = ["codigo", "nombre", "descripcion", "marca", "cantidad"];

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        //let dataPedidoAlmacen:any = localStorage.getItem('dataPedido');
        //dataPedidoAlmacen = JSON.parse(dataPedidoAlmacen);
        setTimeout(() => {
            this.dataSourceMedicamento = new MatTableDataSource(this.data.productosMedicamento);
            this.dataSourceAbarrotes = new MatTableDataSource(this.data.productosAbarrote);
            this.dataSourceCosmeticos = new MatTableDataSource(this.data.productosCosmetico);
            this.dataSourceMedicamento.paginator = this.paginatorMedicamento
            this.dataSourceAbarrotes.paginator = this.paginatorAbarrotes
            this.dataSourceCosmeticos.paginator = this.paginatorCosmeticos
        }, 400);
    }

    onChange(event) {
        if (event.checked) {
            this.productosRechazados.push(event.source.value);
        } else {
            const i = this.productosRechazados.findIndex((x) => x === event.source.value);
            this.productosRechazados.splice(i, 1);
        }
        //console.log(this.productosRechazados);
    }

    onClick(data: any) {
        this.spinner.show();
        let productosPP: any[] = [];

        data.productosMedicamento.map((item, index) => {
            let medicamentoIndex = false;
            for (let i = 0; i < this.productosRechazados.length; i++) {
                if (this.productosRechazados[i] == item.codigo) {
                    medicamentoIndex = true;
                }
            }
            if (!medicamentoIndex) {
                productosPP.push({ codigo: item.codigo, cantidad: item.cantidad });
            }
        });
        data.productosAbarrote.map((item, index) => {
            let abarroteIndex = false;
            for (let i = 0; i < this.productosRechazados.length; i++) {
                if (this.productosRechazados[i] == item.codigo) {
                    abarroteIndex = true;
                }
            }
            if (!abarroteIndex) {
                productosPP.push({ codigo: item.codigo, cantidad: item.cantidad });
            }
        });
        data.productosCosmetico.map((item, index) => {
            let cosmeticosIndex = false;
            for (let i = 0; i < this.productosRechazados.length; i++) {
                if (this.productosRechazados[i] == item.codigo) {
                    cosmeticosIndex = true;
                }
            }
            if (!cosmeticosIndex) {
                productosPP.push({ codigo: item.codigo, cantidad: item.cantidad });
            }
        });

        let item: any = localStorage.getItem("datosUser");
        item = JSON.parse(item);

        let idSucursal: number = item.idSucursal;

        let datos = {
            idpasoProducto: data.idpasoProducto,
            idSucursalDes: idSucursal,
            productosPP: productosPP,
        };

        this.sucursalService.actualizarInventario(datos, this.token).subscribe(
            (res) => {
                this.spinner.hide();
                notify("El pedido fue aceptado", "success");
                this.dialogRef.close();
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

    openValidarClave(data: any) {
        const dialogRef = this.dialog.open(ModelPasswordComponent, {
            width: "400px",
            data: { ...data },
        });
    }

    verificarSolicitud(data: any) {
        this.spinner.show();
        this.sucursalService.solicitudStatus(this.token, data.idpasoProducto).subscribe(
            (res) => {
                this.spinner.hide();
                if (res.codigo == 6) {
                    notify(res.mensaje, "danger");
                } else if (res.codigo == 0) {
                    notify(res.mensaje, "success");
                }
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
