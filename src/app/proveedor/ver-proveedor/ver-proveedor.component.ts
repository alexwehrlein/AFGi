import { Component, OnInit } from '@angular/core';
import { Proveedor } from "../../models/proveedor";
import { ProveedorService } from "../../services/proveedor.service";
import { notify } from '../../notificaciones/notify';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ver-proveedor',
  templateUrl: './ver-proveedor.component.html',
  styleUrls: ['./ver-proveedor.component.css']
})
export class VerProveedorComponent implements OnInit {
  
  token:string;
  idProveedor:number; 
  proveedores: Array<Proveedor> = new Array<Proveedor>();

  constructor(private proveedorInyectable: ProveedorService,private router:Router ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")
    if(this.token == null){
      this.router.navigate(['login']);
    }
    this.octenerProveederos();
  }

  elejirProveedor(id:number){
    this.idProveedor = id
    notify('¿Desea eliminar este proveedor? <br> <a style="top: 5px;float:none; right:5px; bottom: 5px;" class="cursor btnBorrarTmpUsuario white-text btn right" (click)="eliminarEmpleado()">aceptar</a>' , "danger");
    let newButton = document.querySelector(".btnBorrarTmpUsuario");
    newButton.addEventListener("click", this.eliminarProveedor.bind(this)); 
  }

  eliminarProveedor(){
    this.proveedorInyectable.eliminarProveedor(this.idProveedor,this.token).subscribe(res => {
    
        notify("El proveedor fue eliminado exitosamente","success");
        setTimeout(()=>{
          this.octenerProveederos();
        },1000)
     
    }, (res) => {
      if(res.codigo == 5){
        notify(res.mensaje ,"danger");
      }
      if(res.codigo == 3){
        notify(res.mensaje ,"danger");
        setTimeout(()=>{
          this.router.navigate(['login']);
        },1000)
      }
    })
  }  

  octenerProveederos(){
    this.proveedores.length = 0
    this.proveedorInyectable.octenerTodosLosProveedores(this.token).subscribe(proveedores => {
      this.proveedores = proveedores;
    },(res) => {
      if(res.codigo == 5){
        notify(res.mensaje ,"danger");
      }
      if(res.codigo == 3){
        notify(res.mensaje ,"danger");
        setTimeout(()=>{
          this.router.navigate(['login']);
        },1000)
      }
    });
  }

}
