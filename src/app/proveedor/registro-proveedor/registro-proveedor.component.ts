import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { notify } from "../../notificaciones/notify";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ProveedorService } from "../../services/proveedor.service";
import { Proveedor } from "../../models/proveedor";

interface Estados {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-registro-proveedor",
  templateUrl: "./registro-proveedor.component.html",
  styleUrls: ["./registro-proveedor.component.css"],
})
export class RegistroProveedorComponent implements OnInit {
  estados: Estados[] = [
    { value: "Aguascalientes", viewValue: "Aguascalientes" },
    { value: "Baja California", viewValue: "Baja California" },
    { value: "Baja California Sur", viewValue: "Baja California Sur" },
    { value: "Campeche", viewValue: "Campeche" },
    { value: "Chiapas", viewValue: "Chiapas" },
    { value: "Chihuahua", viewValue: "Chihuahua" },
    { value: "CDMX", viewValue: "Ciudad de México" },
    { value: "Coahuila", viewValue: "Coahuila" },
    { value: "Colima", viewValue: "Colima" },
    { value: "Durango", viewValue: "Durango" },
    { value: "Estado de México", viewValue: "Estado de México" },
    { value: "Guanajuato", viewValue: "Guanajuato" },
    { value: "Guerrero", viewValue: "Guerrero" },
    { value: "Hidalgo", viewValue: "Hidalgo" },
    { value: "Jalisco", viewValue: "Jalisco" },
    { value: "Michoacán", viewValue: "Michoacán" },
    { value: "Morelos", viewValue: "Morelos" },
    { value: "Nayarit", viewValue: "Nayarit" },
    { value: "Nuevo León", viewValue: "Nuevo León" },
    { value: "Oaxaca", viewValue: "Oaxaca" },
    { value: "Puebla", viewValue: "Puebla" },
    { value: "Querétaro", viewValue: "Querétaro" },
    { value: "Quintana Roo", viewValue: "Quintana Roo" },
    { value: "San Luis Potosí", viewValue: "San Luis Potosí" },
    { value: "Sinaloa", viewValue: "Sinaloa" },
    { value: "Sonora", viewValue: "Sonora" },
    { value: "Tabasco", viewValue: "Tabasco" },
    { value: "Tamaulipas", viewValue: "Tamaulipas" },
    { value: "Tlaxcala", viewValue: "Tlaxcala" },
    { value: "Veracruz", viewValue: "Veracruz" },
    { value: "Yucatán", viewValue: "Yucatán" },
    { value: "Zacatecas", viewValue: "Zacatecas" },
  ];
  esNuevoProveedor: boolean = true;
  formularioCrearProveedor: FormGroup;
  idproveedor: number;
  proveedor: Proveedor = new Proveedor();
  token: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private proveedorInyectable: ProveedorService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
    if (this.token == null) {
      this.router.navigate(["login"]);
    }
    this.formularioCrearProveedor = this.formBuilder.group({
      nombre: ["", Validators.required],
      email: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern(
            "^[a-zA-Z0-9._\\-]+\\@[a-zA-Z0-9._\\-]+(\\.[a-zA-Z]+)+$"
          ),
        ]),
      ],
      telefono: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{10}"),
        ]),
      ],
      ciudad: ["", Validators.required],
      estado: ["", Validators.required],
    });

    let id = this.activeRoute.snapshot.params.proveedorId;
    this.idproveedor = id;
    if (id != undefined) {
      this.esNuevoProveedor = false;
      this.proveedorInyectable.octenerProveedor(id, this.token).subscribe(
        (proveedor) => {
          this.formularioCrearProveedor.setValue({
            nombre: proveedor.nombre,
            email: proveedor.email,
            telefono: proveedor.telefono,
            ciudad: proveedor.ciudad,
            estado: proveedor.estado,
          });
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
    this.proveedor = this.formularioCrearProveedor.value as Proveedor;
    this.proveedorInyectable
      .registarProveedor(this.proveedor, this.token)
      .subscribe(
        (res) => {
          if (res.codigo == "0") {
            //this.formularioCrearProveedor.reset();
            notify("El proveedor fue registro exitosamente", "success");
            setTimeout(() => {
              this.router.navigate(["proveedor-list"]);
            }, 1000);
          } else if (res.codigo == "500") {
            notify(res.mensaje, "danger");
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

  modificar() {
    this.proveedor = this.formularioCrearProveedor.value as Proveedor;
    this.proveedorInyectable
      .editarProveedor(this.proveedor, this.idproveedor, this.token)
      .subscribe(
        (res) => {
          //this.formularioCrearProveedor.reset();
          notify("El proveedor fue actualizado exitosamente", "success");
          this.esNuevoProveedor = true;
          setTimeout(() => {
            this.router.navigate(["proveedor-list"]);
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
