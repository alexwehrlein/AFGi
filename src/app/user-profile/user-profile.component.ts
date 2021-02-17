import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { notify } from "../notificaciones/notify";
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { UsuarioService } from "../services/usuario.service";
import { Usuario } from "../models/usuarios";
import { Sucursal } from "../models/sucursal";
import { Turno } from "../models/turno";
import { Router } from "@angular/router";

@Component({
    selector: "app-user-profile",
    templateUrl: "./user-profile.component.html",
    styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
    token: string;
    esNuevo: boolean = true;
    sucurdales: Array<Sucursal> = new Array<Sucursal>();
    turnos: Array<Turno> = new Array<Turno>();
    turnosCliente: Array<Turno> = new Array<Turno>();
    formularioCrearEmpleado: FormGroup;
    usuario: Usuario = new Usuario();
    id: string = "";
    isCheck1 = false;
    isCheck2 = false;
    isCheck3 = false;
    isCheck4 = false;
    isCheck5 = false;
    isCheck6 = false;

    constructor(
        private formBuilder: FormBuilder,
        private sucursalInyectable: UsuarioService,
        private activeRoute: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
        this.token = localStorage.getItem("token");
        if (this.token == null) {
            this.router.navigate(["login"]);
        }
        this.formularioCrearEmpleado = this.formBuilder.group({
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
            username: ["", Validators.compose([Validators.required, Validators.minLength(4)])],
            password: ["", Validators.compose([Validators.required, Validators.minLength(5)])],
            idSucursal: ["", Validators.required],
            permisos: ["", Validators.required],
            idTurnos: this.formBuilder.array([]),
        });

        this.sucursalInyectable.octenerSucursales(this.token).subscribe(
            (sucursales) => {
                this.sucurdales = sucursales;
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

        this.sucursalInyectable.octenerTurnos(this.token).subscribe(
            (turnos) => {
                this.turnos = turnos;
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

        let id = this.activeRoute.snapshot.params.empleadoId;
        this.id = id;
        if (id != undefined) {
            this.esNuevo = false;
            this.sucursalInyectable.octenerUsuario(id, this.token).subscribe(
                (cliente) => {
                    console.log(cliente);
                    this.formularioCrearEmpleado.setValue({
                        nombre: cliente.nombre,
                        email: cliente.email,
                        telefono: cliente.telefono,
                        idSucursal: cliente.idSucursal,
                        username: cliente.username,
                        password: cliente.password,
                        permisos: 0,
                        idTurnos: [],
                    });
                    this.formularioCrearEmpleado.controls["nombre"].disable();
                    this.formularioCrearEmpleado.controls["email"].disable();
                    this.formularioCrearEmpleado.controls["telefono"].disable();
                    this.formularioCrearEmpleado.controls["username"].disable();
                    this.formularioCrearEmpleado.controls["permisos"].disable();

                    this.turnosCliente = cliente.turnos;

                    this.turnosCliente.map((turno) => {
                        const interests = (<FormArray>(
                            this.formularioCrearEmpleado.get("idTurnos")
                        )) as FormArray;

                        if (turno.idTurno == 1) {
                            this.isCheck1 = true;
                            interests.push(new FormControl(turno.idTurno));
                        }
                        if (turno.idTurno == 2) {
                            this.isCheck2 = true;
                            interests.push(new FormControl(turno.idTurno));
                        }
                        if (turno.idTurno == 3) {
                            this.isCheck3 = true;
                            interests.push(new FormControl(turno.idTurno));
                        }
                        if (turno.idTurno == 4) {
                            this.isCheck4 = true;
                            interests.push(new FormControl(turno.idTurno));
                        }
                        if (turno.idTurno == 5) {
                            this.isCheck5 = true;
                            interests.push(new FormControl(turno.idTurno));
                        }
                        if (turno.idTurno == 6) {
                            this.isCheck6 = true;
                            interests.push(new FormControl(turno.idTurno));
                        }
                    });
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
    }

    onChange(event) {
        const interests = (<FormArray>this.formularioCrearEmpleado.get("idTurnos")) as FormArray;

        if (event.checked) {
            interests.push(new FormControl(event.source.value));
        } else {
            const i = interests.controls.findIndex((x) => x.value === event.source.value);
            interests.removeAt(i);
        }
    }

    agregar() {
        if (this.formularioCrearEmpleado.value.idTurnos.length == 0) {
            notify("Debe seleccionar por lo menos un turno.", "danger");
            return;
        }
        this.usuario = this.formularioCrearEmpleado.value as Usuario;
        if (this.formularioCrearEmpleado.value.permisos == 1) {
            this.usuario.authorities = ["ROLE_ADMIN"];
        } else if (this.formularioCrearEmpleado.value.permisos == 2) {
            this.usuario.authorities = ["ROLE_CAJERO"];
        } else if (this.formularioCrearEmpleado.value.permisos == 3) {
            this.usuario.authorities = ["ROLE_USER"];
        }
        console.log(this.usuario);
        this.sucursalInyectable.guardarUsuario(this.usuario, this.token).subscribe(
            (usuario) => {
                //this.formularioCrearEmpleado.reset();
                notify("El empleado fue registro exitosamente", "success");
                setTimeout(() => {
                    this.router.navigate(["user-list"]);
                }, 1000);
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

    modificar() {
        this.usuario = this.formularioCrearEmpleado.value as Usuario;
        delete this.usuario.nombre;
        delete this.usuario.email;
        delete this.usuario.telefono;
        delete this.usuario.turnos;
        delete this.usuario.authorities;
        this.sucursalInyectable.editarUsuario(this.usuario, this.id, this.token).subscribe(
            (res) => {
                this.formularioCrearEmpleado.reset();
                notify("El empleado fue actualizado exitosamente", "success");
                setTimeout(() => {
                    this.router.navigate(["user-list"]);
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
