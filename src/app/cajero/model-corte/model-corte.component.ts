import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import { notify } from 'app/notificaciones/notify';
import { VentasService } from 'app/services/ventas.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-model-corte',
  templateUrl: './model-corte.component.html',
  styleUrls: ['./model-corte.component.css']
})
export class ModelCorteComponent implements OnInit {

  recargas:number;
  token:string;

  constructor(public dialogRef: MatDialogRef<ModelCorteComponent>,
    private spinner: NgxSpinnerService, private ventaService: VentasService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
  }

  guardar(){
    this.spinner.show();

    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);

    let corte = {
      nuevoSaldo: this.recargas,
      idEmpleado: datos.idEmpleado,
      idSucursal: datos.idSucursal,
    };

    this.ventaService.corte(corte , this.token ).subscribe( res => {
      this.spinner.hide();
      if(res.codigo == "0"){
        this.dialogRef.close({data:res,retorno:true});
      }else if(res.codigo == "5"){
        notify(res.mensaje, "danger");
      }
    });

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
