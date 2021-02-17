import { Component, OnInit } from "@angular/core";
import * as Chartist from "chartist";
import { Router } from "@angular/router";
import { UsuarioService } from "../services/usuario.service";
import { notify } from "../notificaciones/notify";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
    token: string;
    username: string;

    constructor(private usuarioService: UsuarioService,
         private router: Router
         ) {}

    ngOnInit() {
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
