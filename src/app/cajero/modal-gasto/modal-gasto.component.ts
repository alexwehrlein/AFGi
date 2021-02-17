import { Component, OnInit } from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { notify } from "app/notificaciones/notify";
import { VentasService } from "app/services/ventas.service";

@Component({
  selector: "app-modal-gasto",
  templateUrl: "./modal-gasto.component.html",
  styleUrls: ["./modal-gasto.component.css"],
})
export class ModalGastoComponent implements OnInit {
  descripccion: string;
  cantidad: number;
  responsable: string;
  token: string;

  constructor(
    public dialogRef: MatDialogRef<ModalGastoComponent>,
    private spinner: NgxSpinnerService,
    private ventaService: VentasService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
  }

  guardar() {
    if (this.descripccion == "" || this.descripccion == null) {
      notify("Ingrese una descripciòn.", "danger");
      return;
    }

    if (isNaN(this.cantidad)) {
      notify("Ingrese una cantidad valida.", "danger");
      return;
    }

    this.spinner.show();

    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);

    let gasto = {
      tipo: this.descripccion,
      total: this.cantidad,
      responsable: this.responsable,
      idEmpleado: datos.idEmpleado,
      idSucursal: datos.idSucursal,
    };

    this.ventaService.guardarGasto(gasto, this.token).subscribe((res) => {
      this.spinner.hide();
      if (res.codigo == "0") {
        notify(res.mensaje, "success");
        this.dialogRef.close();
      } else if (res.codigo == "500") {
        notify(res.mensaje, "danger");
      }
    });
  }

  validarnombre(event) {
    var out = "";
    var filtro =
      "abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZàèìòùÜ ";

    for (var i = 0; i < event.target.value.length; i++)
      if (filtro.indexOf(event.target.value.charAt(i)) != -1)
        out += event.target.value.charAt(i);

    event.target.value = out;
  }

  validarNumero(event) {
    var out = "";
    var filtro = "1234567890";

    for (var i = 0; i < event.target.value.length; i++)
      if (filtro.indexOf(event.target.value.charAt(i)) != -1)
        out += event.target.value.charAt(i);

    event.target.value = out;
  }
}
