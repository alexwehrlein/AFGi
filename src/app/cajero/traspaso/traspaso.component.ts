import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Producto } from "../../models/producto";
import { ProductoService } from "../../services/producto.service";
import { Sucursal } from "../../models/sucursal";
import { Router } from "@angular/router";
import { notify } from "../../notificaciones/notify";
import { ModelTraspasoComponent } from "../model-traspaso/model-traspaso.component";
import { ModalInfoComponent } from "../modal-info/modal-info.component";
import { UsuarioService } from "../../services/usuario.service";
import { SucursalService } from "../../services/sucursal.service";
import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: "app-traspaso",
    templateUrl: "./traspaso.component.html",
    styleUrls: ["./traspaso.component.css"],
})
export class TraspasoComponent implements OnInit {
    displayedColumns: string[] = ["codigo", "nombre", "descripcion", "agregar"];
    displayedColumnsPeticion: string[] = ["codigo", "cantidad", "opciones"];
    @ViewChild("paginatorProductos", { read: MatPaginator }) paginatorProductos: MatPaginator;
    @ViewChild("paginatorCompra", { read: MatPaginator }) paginatorPeticion: MatPaginator;
    sucurdales: Array<Sucursal> = new Array<Sucursal>();
    ELEMENT_DATA_PRODUCTOS: Array<Producto> = new Array<Producto>();
    ELEMENT_DATA_PETICION: Array<Producto> = new Array<Producto>();
    token: string;
    dataSource;
    idSucursal: number = null;
    leccionSucursal: boolean = false;
    pedidoSucursal: Array<any> = new Array<any>();
    password: string;

    constructor(
        private sucursalService: SucursalService,
        private sucursalInyectable: UsuarioService,
        public dialog: MatDialog,
        private router: Router,
        private productoInyectable: ProductoService,
        private spinner: NgxSpinnerService,
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        if (this.token == null) {
            this.router.navigate(["login"]);
        }
        this.octenerProductos();
        this.octenerSucursales();
        this.octenerDatosPedicionesSucursales();
    }

    octenerProductos() {
        this.ELEMENT_DATA_PRODUCTOS.length = 0;
        this.productoInyectable.octenrtProductos(this.token, "medicamento").subscribe(
            (productos) => {
                this.ELEMENT_DATA_PRODUCTOS = this.ELEMENT_DATA_PRODUCTOS.concat(productos);
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
        this.productoInyectable.octenrtProductos(this.token, "abarrote").subscribe(
            (productos) => {
                this.ELEMENT_DATA_PRODUCTOS = this.ELEMENT_DATA_PRODUCTOS.concat(productos);
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
        this.productoInyectable.octenrtProductos(this.token, "cosmetico").subscribe(
            (productos) => {
                this.ELEMENT_DATA_PRODUCTOS = this.ELEMENT_DATA_PRODUCTOS.concat(productos);
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA_PRODUCTOS);
                this.dataSource.paginator = this.paginatorProductos;
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

    octenerSucursales() {
        this.sucursalInyectable.octenerSucursales(this.token).subscribe(
            (sucursales) => {
                let datosUser: any = localStorage.getItem("datosUser");
                datosUser = JSON.parse(datosUser);
                const i = sucursales.findIndex((x) => x.idSucursal === datosUser.idSucursal);
                sucursales.splice(i, 1);
                this.sucurdales = sucursales;
            },
            (res) => {
                if (res.codigo == 3) {
                    notify(res.mensaje, "danger");
                    this.router.navigate(["login"]);
                }
            }
        );
    }

    applyFilterProduc(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    octenerDatosPedicionesSucursales() {
        let pedidoSucursal: any = localStorage.getItem("pedidoSucursal");
        pedidoSucursal = JSON.parse(pedidoSucursal);

        if (pedidoSucursal == null || pedidoSucursal == "null") {
            pedidoSucursal = [];
            this.leccionSucursal = false;
        }

        this.pedidoSucursal = pedidoSucursal;
    }

    openDialog(data: Producto): void {
        if (this.idSucursal == null) {
            notify("Seleccione una sucursal", "danger");
            return;
        }

        let datosUser: any = localStorage.getItem("datosUser");
        datosUser = JSON.parse(datosUser);

        const dialogRef = this.dialog.open(ModelTraspasoComponent, {
            width: "450px",
            disableClose: true,
            data: {
                codigo: data.codigo,
                cantidad: 1,
                idSucursalDes: datosUser.idSucursal,
                index: null,
                idSucursalOri: this.idSucursal,
                nombreOri: datosUser.sucursal,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == undefined) {
                this.leccionSucursal = true;
                this.octenerDatosPedicionesSucursales();
            }
        });
    }

    openDialogEditar(data: Producto, index): void {
        if (this.idSucursal == null) {
            notify("Seleccione una sucursal", "danger");
            return;
        }

        let datosUser: any = localStorage.getItem("datosUser");
        datosUser = JSON.parse(datosUser);

        const dialogRef = this.dialog.open(ModelTraspasoComponent, {
            width: "450px",
            disableClose: true,
            data: {
                codigo: data.codigo,
                cantidad: data.cantidad,
                idSucursalDes: datosUser.idSucursal,
                index: index,
                idSucursalOri: this.idSucursal,
                nombreOri: datosUser.sucursal,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == undefined) {
                this.leccionSucursal = true;
                this.octenerDatosPedicionesSucursales();
            }
        });
    }

    eliminarPeticion(index: number) {
        let pedidoSucursal: any = localStorage.getItem("pedidoSucursal");
        pedidoSucursal = JSON.parse(pedidoSucursal);
        pedidoSucursal.splice(index, 1);
        localStorage.setItem("pedidoSucursal", JSON.stringify(pedidoSucursal));
        this.octenerDatosPedicionesSucursales();
    }

    agregar() {
        this.spinner.show();
        let pedidoSucursal: any = localStorage.getItem("pedidoSucursal");
        pedidoSucursal = JSON.parse(pedidoSucursal);

        let datosUser: any = localStorage.getItem("datosUser");
        datosUser = JSON.parse(datosUser);

        if (pedidoSucursal.length == 0) {
            notify("No a selecciónado ningun producto.", "danger");
            return;
        }

        let datos: any = {
            idSucursalOri: datosUser.idSucursal,
            idSucursalDes: this.idSucursal,
            nombreOri: datosUser.sucursal,
            productosPP: pedidoSucursal,
        };

        this.sucursalService.solicitud(datos, this.token).subscribe(
            (res) => {
                //console.log(res);
                this.spinner.hide()
                this.idSucursal = 0;
                notify("Se a enviado la peticion a la sucursal.", "success");
                const dialogRef = this.dialog.open(ModalInfoComponent, {
                    width: "450px",
                    disableClose: true,
                    data: {...res
                    },
                });
                this.leccionSucursal = false;
                localStorage.setItem("pedidoSucursal", "[]");
                this.octenerDatosPedicionesSucursales();
            },
            (res) => {
                this.spinner.hide()
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
