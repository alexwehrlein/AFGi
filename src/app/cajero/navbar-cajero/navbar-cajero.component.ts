import { Component, OnInit, OnDestroy, Output, EventEmitter} from "@angular/core";
import { notify } from "../../notificaciones/notify";
import { Router } from "@angular/router";
import { SucursalService } from "../../services/sucursal.service";
import { ModelPendientesComponent } from "../model-pendientes/model-pendientes.component";
import { MatDialog } from "@angular/material/dialog";
import { LoginService } from "app/services/login.service";
import { ModalGastoComponent } from "../modal-gasto/modal-gasto.component";

@Component({
    selector: "app-navbar-cajero",
    templateUrl: "./navbar-cajero.component.html",
    styleUrls: ["./navbar-cajero.component.css"],
})
export class NavbarCajeroComponent implements OnInit , OnDestroy{
    @Output() actualizarProductos = new EventEmitter(); 
    notificaciones;
    pendientes: any[] = [];
    token: string;
    rol:string;
    dataSource;
    constructor(
        private router: Router,
        private sucursalService: SucursalService,
        public dialog: MatDialog,
        private loginService: LoginService
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        this.rol = localStorage.getItem("rol");

        if (this.token == null) {
            this.router.navigate(["login"]);
        }

        if(this.rol === "ROLE_CAJERO"){
            //this.router.navigate(["cajero/home"]);
        }else if(this.rol === "ROLE_ADMIN"){
            this.router.navigate(["dashboard"]);
        }else if(this.rol === "ROLE_USER"){
            //this.router.navigate(["login"]);
        }else{
            console.log("no existe rol");
        }

        setTimeout(() => {
            this.notificacionesHechas();
        }, 1000);

        this.notificaciones = setInterval(() => {
            this.notificacionesHechas();
        }, 10000);
    }

    ngOnDestroy() {
        clearInterval(this.notificaciones);
      }

    notificacionesHechas() {
        let datos: any = localStorage.getItem("datosUser");
        datos = JSON.parse(datos);
        let idSucursal: number = datos.idSucursal;

        this.sucursalService.solicitudHechas(this.token, idSucursal).subscribe(
            (res) => {
                res = res == null ? [] : res;
                res.map((item, i) => {
                    res[i].tipo = "Solicitud Hecha";
                    res[i].seleccionadosMedicamnetos = [];
                    res[i].seleccionadosAbarrotes = [];
                    res[i].seleccionadosCosmeticos = [];
                    res[i].cantidadSolicitadaMedicamentos = [];
                    res[i].cantidadSolicitadaAbarrotes = [];
                    res[i].cantidadSolicitadaCosmeticos = [];
                });
                this.pendientes = res;
                this.pendientesNotificaciones();
                //console.log(this.pendientes);
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

    pendientesNotificaciones() {
        let datos: any = localStorage.getItem("datosUser");
        datos = JSON.parse(datos);
        let idSucursal: number = datos.idSucursal;

        this.sucursalService.pendientes(this.token, idSucursal).subscribe(
            (res) => {
                res = res == null ? [] : res;
                res.map((item, i) => {
                    res[i].tipo = "Pedido";
                    res[i].seleccionados = [];
                    res[i].cantidadSolicitada = [];
                });
                this.pendientes = this.pendientes.concat(res);
                this.peticionesMedicamentos();
                //console.log(this.pendientes);
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

    peticionesMedicamentos() {
        let datos: any = localStorage.getItem("datosUser");
        datos = JSON.parse(datos);
        let idSucursal: number = datos.idSucursal;

        this.sucursalService.peticionesMedicamento(this.token, idSucursal).subscribe(
            (res) => {
                res = res == null ? [] : res;
                res.map((item, i) => {
                    res[i].tipo = "Solicitud";
                    res[i].seleccionadosMedicamnetos = [];
                    res[i].seleccionadosAbarrotes = [];
                    res[i].seleccionadosCosmeticos = [];
                    res[i].cantidadSolicitadaMedicamentos = [];
                    res[i].cantidadSolicitadaAbarrotes = [];
                    res[i].cantidadSolicitadaCosmeticos = [];
                });
                this.pendientes = this.pendientes.concat(res);
                //console.log(this.pendientes);
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

    openDialog(data: any): void {
        if (data.tipo != "Pedido") {
            for (let index = 0; index < data.productosMedicamento.length; index++) {
                data.seleccionadosMedicamnetos.push(data.productosMedicamento[index].cantidad);
                data.cantidadSolicitadaMedicamentos.push(data.productosMedicamento[index].cantidad);
            }

            for (let index = 0; index < data.productosAbarrote.length; index++) {
                data.seleccionadosAbarrotes.push(data.productosAbarrote[index].cantidad);
                data.cantidadSolicitadaAbarrotes.push(data.productosAbarrote[index].cantidad);
            }

            for (let index = 0; index < data.productosCosmetico.length; index++) {
                data.seleccionadosCosmeticos.push(data.productosCosmetico[index].cantidad);
                data.cantidadSolicitadaCosmeticos.push(data.productosCosmetico[index].cantidad);
            }
        }

        localStorage.setItem("idpasoProducto", data.idpasoProducto);
        localStorage.setItem('dataPedido' , JSON.stringify(data))
        const dialogRef = this.dialog.open(ModelPendientesComponent, {
            width: "1000px",
            data: { ...data },
            disableClose: true,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == undefined) {
                this.notificacionesHechas();
                this.actualizarProductos.emit();
            }
        });
    }

    logout(){
        this.loginService.logout(this.token).subscribe(res => {
            this.router.navigate(["login"]);
        })
    }

    gastos(){
        const dialogRef = this.dialog.open(ModalGastoComponent, {
            width: "40%",
            disableClose: true,
          });
    }
}
