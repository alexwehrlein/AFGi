import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { notify } from "../../notificaciones/notify";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ClientesService } from "../../services/clientes.service";
import { Cliente } from "../../models/cliente";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: "app-registro-clientes",
    templateUrl: "./registro-clientes.component.html",
    styleUrls: ["./registro-clientes.component.css"],
})
export class RegistroClientesComponent implements OnInit {
    token: string;
    esNuevoCliente: boolean = true;
    formularioCrearCliente: FormGroup;
    idCliente: number;
    cliente: Cliente = new Cliente();
    cajero: boolean = false;

    constructor(
        private spinner: NgxSpinnerService,
        private formBuilder: FormBuilder,
        private router: Router,
        private activeRoute: ActivatedRoute,
        private clienteInyectable: ClientesService
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        if (localStorage.getItem("rol") == "ROLE_CAJERO") {
            this.cajero = true;
            console.log("cajero");
        }
        if (this.token == null) {
            this.router.navigate(["login"]);
        }
        this.formularioCrearCliente = this.formBuilder.group({
            nombre: ["", Validators.required],
            email: [
                "",
                Validators.compose([
                    Validators.required,
                    Validators.pattern("^[a-zA-Z0-9._\\-]+\\@[a-zA-Z0-9._\\-]+(\\.[a-zA-Z]+)+$"),
                ]),
            ],
            telefono: [
                "",
                Validators.compose([Validators.required, Validators.pattern("^[0-9]{10}")]),
            ],
            descuentoPatente: [this.cajero == true ? "5" : "0", Validators.required],
            descuentoGenerico: [this.cajero == true ? "10" : "0", Validators.required],
            descuentoMaterial: [this.cajero == true ? "5" : "0", Validators.required],
        });

        let id = this.activeRoute.snapshot.params.clienteId;
        this.idCliente = id;
        if (id != undefined) {
            this.esNuevoCliente = false;
            this.clienteInyectable.octenerCliente(id, this.token).subscribe(
                (cliente) => {
                    this.formularioCrearCliente.setValue({
                        nombre: cliente.nombre,
                        email: cliente.email,
                        telefono: cliente.telefono,
                        descuentoPatente: cliente.descuentoPatente,
                        descuentoGenerico: cliente.descuentoGenerico,
                        descuentoMaterial: cliente.descuentoMaterial,
                    });
                    this.formularioCrearCliente.controls["nombre"].disable();
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

    agregar() {
        this.spinner.show();
        this.cliente = this.formularioCrearCliente.value as Cliente;
        this.clienteInyectable.registarCliente(this.cliente, this.token).subscribe(
            (res) => {
                //this.formularioCrearCliente.reset();
                notify("El cliente fue registrado exitosamente", "success");
                this.spinner.hide();
                if (this.cajero) {
                    setTimeout(() => {
                        this.router.navigate(["/cajero/clientes"]);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.router.navigate(["clientes-list"]);
                    }, 1000);
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

    modificar() {
        this.spinner.show();
        this.cliente = this.formularioCrearCliente.value as Cliente;

        let datosDescuentos = {
            idCliente: this.idCliente,
            descuentoPatente: this.cliente.descuentoPatente,
            descuentoGenerico: this.cliente.descuentoGenerico,
            descuentoMaterial: this.cliente.descuentoMaterial,
        };

        delete this.cliente.descuentoPatente;
        delete this.cliente.descuentoGenerico;
        delete this.cliente.descuentoMaterial;

        this.clienteInyectable.editarCliente(this.cliente, this.idCliente, this.token).subscribe(
            (res) => {
                this.modificarDescuentos(datosDescuentos);
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

    modificarDescuentos(datosDescuentos) {
        this.clienteInyectable.editarDescuentos(datosDescuentos, this.token).subscribe(
            (res) => {
                //this.formularioCrearCliente.reset();
                notify("El cliente fue actualizado exitosamente", "success");
                this.esNuevoCliente = true;
                this.spinner.hide();
                if (this.cajero) {
                    setTimeout(() => {
                        this.router.navigate(["/cajero/clientes"]);
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.router.navigate(["clientes-list"]);
                    }, 1000);
                }
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

    validarnombre(event){
        var out = '';
        var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZàèìòùÜ ';
        
        for (var i=0; i<event.target.value.length; i++)
           if (filtro.indexOf(event.target.value.charAt(i)) != -1) 
                 
              out += event.target.value.charAt(i);
        
          event.target.value = out;
    }

    validarNumero(event){
        var out = '';
        var filtro = '1234567890';
        
        for (var i=0; i<event.target.value.length; i++)
           if (filtro.indexOf(event.target.value.charAt(i)) != -1) 
                 
              out += event.target.value.charAt(i);
        
          event.target.value = out;
    }
}
