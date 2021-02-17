import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { notify } from "../../notificaciones/notify";
import { NgxSpinnerService } from "ngx-spinner";
import { Consultorio } from "../../models/consultorio";
import { VentasService } from "app/services/ventas.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-model-consultorio',
  templateUrl: './model-consultorio.component.html',
  styleUrls: ['./model-consultorio.component.css']
})
export class ModelConsultorioComponent implements OnInit {

  consultorio:Consultorio[] = [];
  consultorioVenta:Consultorio = new Consultorio();
  token:string;

  constructor(
    private spinner: NgxSpinnerService,
    private ventaService: VentasService,
    private router: Router,
    public dialogRef: MatDialogRef<ModelConsultorioComponent>
  ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token");

    this.ventaService.octenerProductosConsulta(this.token).subscribe( res => {
      this.consultorio = res;
    })
  }

  onChange(id){
    this.consultorioVenta = this.consultorio.find( res => res.idConsultorio == id);
  }

  venta(){

    if(Object.keys(this.consultorioVenta).length == 0){
      notify("Elegir una opcion de venta" , "danger");
      return;
    }

    this.spinner.show();

    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);

    let consulta = {
      "medico":"Francisco Nava",
      "idEmpleado":datos.idEmpleado,
      "idConsultorio":this.consultorioVenta.idConsultorio,
      "idSucursal":datos.idSucursal
    }

    this.ventaService.ventaConsulta(this.token , consulta).subscribe( res => {
      console.log(res);
      this.spinner.hide();
      if(res.codigo == "0"){
        notify(res.mensaje, "success");
        this.dialogRef.close({
          data:true,
          turno:res.turno,
          tipo:this.consultorioVenta.nombre
        });
      }
    },(res) => {
      this.spinner.hide();
      if (res.codigo == 3) {
        notify(res.mensaje, "danger");
        setTimeout(() => {
          this.router.navigate(["login"]);
        }, 1000);
      }
    })
    
  }

}
