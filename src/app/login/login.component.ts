import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { notify } from "../notificaciones/notify";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Login } from "../models/login";
import { LoginService } from "../services/login.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
    formularioLogin: FormGroup;
    usuario: Login = new Login();

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private loginInyectable: LoginService
    ) {}

    ngOnInit(): void {
        localStorage.removeItem("token");
        this.formularioLogin = this.formBuilder.group({
            username: ["", Validators.required],
            password: ["", Validators.required],
        });
    }

    login() {
        this.usuario = this.formularioLogin.value as Login;
        this.loginInyectable.login(this.usuario).subscribe(
            (res) => {
                console.log(res);
                localStorage.setItem("token", res.token);
                localStorage.setItem("rol", res.user.authorities[0].authority);
                localStorage.setItem("username", res.user.username);
                if (res.user.authorities[0].authority == "ROLE_ADMIN") {
                    setTimeout(() => {
                        this.router.navigate(["dashboard"]);
                    }, 500);
                } else {
                    setTimeout(() => {
                        this.router.navigate(["cajero/home"]);
                    }, 500);
                }
            },
            (res) => {
                if (res.codigo == 5) {
                    notify(res.mensaje, "danger");
                }
            }
        );
    }
}
