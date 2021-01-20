import { Component, OnInit, ViewChild } from "@angular/core";
import { Cliente } from "../../models/cliente";
import { ClientesService } from "../../services/clientes.service";
import { notify } from "../../notificaciones/notify";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: "app-ver-clientes",
    templateUrl: "./ver-clientes.component.html",
    styleUrls: ["./ver-clientes.component.css"],
})
export class VerClientesComponent implements OnInit {
    token: string;
    idcliente: number;
    clientes: Array<Cliente> = new Array<Cliente>();
    dataSource;
    cajero: boolean = false;
    displayedColumns: string[] = ["id", "nombre", "email", "telefono", "opciones"];
    @ViewChild("paginatorClientes", { read: MatPaginator }) paginatorClientes: MatPaginator;

    constructor(private clienteInyectable: ClientesService, private router: Router) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        if (localStorage.getItem("rol") == "ROLE_CAJERO") {
            this.cajero = true;
        }
        if (this.token == null) {
            this.router.navigate(["login"]);
        }
        this.octenerClientes();
    }

    elejirCliente(id: number) {
        this.idcliente = id;
        notify(
            '¿Desea eliminar este cliente? <br> <a style="top: 5px;float:none; right:5px; bottom: 5px;" class="cursor btnBorrarTmpUsuario white-text btn right" (click)="eliminarEmpleado()">aceptar</a>',
            "danger"
        );
        let newButton = document.querySelector(".btnBorrarTmpUsuario");
        newButton.addEventListener("click", this.eliminarcliente.bind(this));
    }

    eliminarcliente() {
        this.clienteInyectable.eliminarCliente(this.idcliente, this.token).subscribe(
            (res) => {
                notify("El cliente fue eliminado exitosamente", "success");
                setTimeout(() => {
                    this.octenerClientes();
                }, 1000);
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

    octenerClientes() {
        this.clientes.length = 0;
        this.clienteInyectable.octenerTodosLosClientes(this.token).subscribe(
            (clientes) => {
                this.clientes = clientes;
                this.dataSource = new MatTableDataSource(this.clientes);
                this.dataSource.paginator = this.paginatorClientes;
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

    applyFilterProduc(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
