import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../../services/usuario.service";
import { notify } from "../../notificaciones/notify";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

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
}
