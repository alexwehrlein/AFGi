import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../services/usuario.service";
import { notify } from "../../notificaciones/notify";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ModalGastoComponent } from "../modal-gasto/modal-gasto.component";
import { ModelCorteComponent } from "../model-corte/model-corte.component";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
    token: string;
    nombre: string;
    sucursal: string;
    username: string;
    constructor(
        public dialog: MatDialog,
        private usuarioService: UsuarioService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        this.username = localStorage.getItem("username");
        if (this.token == null) {
            this.router.navigate(["login"]);
        }
        this.getDatosUsuario();
    }

    getDatosUsuario() {
        this.usuarioService.obtenerDatos(this.token, this.username).subscribe(
            (res) => {
                this.nombre = res.nombre;
                this.sucursal = res.sucursal;
                localStorage.setItem("datosUser", JSON.stringify(res));
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

    gastos(){
        const dialogRef = this.dialog.open(ModalGastoComponent, {
            width: "40%",
            disableClose: true,
          });
    }

    corte(){
        const dialogRef = this.dialog.open(ModelCorteComponent, {
            width: "40%",
            disableClose: true,
          });

          dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if(result.retorno === true){
              console.log(result.data);
              this.ticketCorte(result.data);
              setTimeout(() => {
                this.ticketConsultorio(result.data);
              }, 1000);
            }
          });
    }

    ticketCorte(res:any){

        let datos: any = localStorage.getItem("datosUser");
        datos = JSON.parse(datos);

        var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        var f = new Date();
        let ticket = `
        <div style="font-size:13px;">
        <div style="margin-top: -44px; margin-bottom: -35px;text-align: center;" class="logo-img">
            <img  style="width: 132px;" src="./assets/img/logo-gi.png"/>
        </div>
        <p>*****CORTE DE CAJA*****</p>
        <p style="margin-top:-11px;>**FARMACIAS GI**</p>
        <p style="margin-top:-11px;">SUCURSAL: ${datos.sucursal}</p>
        <p style="margin-top:-11px;">IGUALA DE LA INDEPENDENCIA, GRO</p>
        <p style="margin-top:-11px;">Fecha:  ${f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()} </p>
        <p style="margin-top:-11px;">*******INGRESOS SISTEMAS*******</p>
        <p style="margin-top:-11px;">VENTAS FARMACIA: $${res.totalVentas}</p>
        <p style="margin-top:-11px;">****************GASTOS****************</p>`;
        
        res.egresos.map(res => {
            ticket += `<p style="margin-top:-11px;">${res.tipo} - Responsable: ${res.responsable} - $ ${res.total}</p>`
        });
        
        ticket += `<p style="margin-top:-11px;">***************RECARGAS***************</p>
        <p style="margin-top:-11px;"><RECARGAS INICIALES: $ ${res.saldoRecargasInicioTurno}</p>
        <p style="margin-top:-11px;">RECARGAS FINALES: $ ${res.saldoRecargasFinTurno}</p>
        <p style="margin-top:-11px;">TOTAL VENTAS RECARGAS: $ ${res.totalGananciaRecargas}</p>
        <p style="margin-top:-11px;">*******TOTAL DE VENTAS*******</p>
        <p style="margin-top:-11px;">VENTAS TOTALES: $ ${res.totalVentas}</p>
        <p style="margin-top:-11px;">GASTOS TOTALES: $ ${res.totalGastos}</p>
        <p style="margin-top:-11px;">*************************************</p>
        <p style="margin-top:-11px;">ENTREGAN CAJEROS: $ ${res.gananciaCajaVenta}</p>
        <p style="margin-top:-11px;">_______________________________________</p>
        </div>
        `;

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(ticket);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
    }

    ticketConsultorio(res:any){

        let datos: any = localStorage.getItem("datosUser");
        datos = JSON.parse(datos);

        let consulta= res.ingresosConsultorio.reduce((total , art )=> {
            if (art.nombre === "Consulta") {
                return total + 1;
              }
              return total;
        },0);

        let aplicaciones = res.ingresosConsultorio.reduce((total , art )=> {
            if (art.nombre === "Aplicaciones") {
                return total + 1;
              }
              return total;
        },0);

        let tomaPrecion = res.ingresosConsultorio.reduce((total , art )=> {
            if (art.nombre === "Toma presión") {
                return total + 1;
              }
              return total;
        },0);

        let glucosa = res.ingresosConsultorio.reduce((total , art )=> {
            if (art.nombre === "Glucosa") {
                return total + 1;
              }
              return total;
        },0);

        let certificado = res.ingresosConsultorio.reduce((total , art )=> {
            if (art.nombre === "Certificado") {
                return total + 1;
              }
              return total;
        },0);

        var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        var f = new Date();
        let ticket = `
        <div style="font-size:13px;">
        <div style="margin-top: -44px; margin-bottom: -35px;text-align: center;" class="logo-img">
            <img  style="width: 132px;" src="./assets/img/logo-gi.png"/>
        </div>
        <p>CORTE DE CAJA</p>
        <p style="margin-top:-11px;>****************************************</p>
        <p style="margin-top:-11px;>FARMACIAS GI</p>
        <p style="margin-top:-11px;">IGUALA DE LA INDEPENDENCIA, GRO</p>
        <p style="margin-top:-11px;">Fecha:  ${f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()} </p>
        <p style="margin-top:-11px;">***** VENTAS CONSULTORIO *****</p>
        <p style="margin-top:-11px;">* TOTAL VENTAS CONSULTORIO: $ ${res.totalVentasConsultorio}</p>
        <p style="margin-top:-11px;">******* DESCRIPCION *******</p>
        <p style="margin-top:-11px;">CONSULTAS: ${consulta} TOTAL: $ ${ consulta * 35}</p>
        <p style="margin-top:-11px;">APLICACIONES: ${aplicaciones} TOTAL: $ ${ aplicaciones * 15}</p>
        <p style="margin-top:-11px;">T/A: ${tomaPrecion} TOTAL: $ ${tomaPrecion * 15}</p>
        <p style="margin-top:-11px;">GLUCOSAS: ${glucosa} TOTAL: $ ${glucosa * 15}</p>
        <p style="margin-top:-11px;">Certificado: ${certificado} TOTAL: $ ${certificado * 35}</p>
        <p style="margin-top:-11px;">* DEBEN PAGAR A MÉDICO : ---> $ ${res.pagoMedico}</p>
        <p style="margin-top:-11px;">====================================</p>
        <p style="margin-top:-11px;">_______________________________________</p>
        </div>
        `;

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(ticket);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
    }
}
