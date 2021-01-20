import { Component, OnInit , ElementRef} from '@angular/core';
import { Sucursal } from "../models/sucursal";
import { UsuarioService } from "../services/usuario.service";
import { notify } from '../notificaciones/notify';
import {Router} from '@angular/router';

@Component({
  selector: 'app-listar-empleados',
  templateUrl: './listar-empleados.component.html',
  styleUrls: ['./listar-empleados.component.css']
})
export class ListarEmpleadosComponent implements OnInit {
  token:string
  idEmpleado:number;
  usuariosSucursal: Array<any> = new Array<any>(); 
  sucurdales: Array<Sucursal> = new Array<Sucursal>();
  constructor( private sucursalInyectable: UsuarioService ,  private router:Router) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token")
    if(this.token == null){
      this.router.navigate(['login']);
    }
    this.octenerEmpleados();
  }

  elejirEmpleado(id:number){
    this.idEmpleado = id
    notify('¿Desea eliminar este empleado? <br> <a style="top: 5px;float:none; right:5px; bottom: 5px;" class="cursor btnBorrarTmpUsuario white-text btn right" (click)="eliminarEmpleado()">aceptar</a>' , "danger");
    let newButton = document.querySelector(".btnBorrarTmpUsuario");
    newButton.addEventListener("click", this.eliminarEmpleado.bind(this)); 
  }

  eliminarEmpleado(){
    this.sucursalInyectable.eliminarUsuario(this.idEmpleado,this.token).subscribe(res => {
        notify("El empleado fue eliminado exitosamente","success");
        setTimeout(()=>{
          this.octenerEmpleados();
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

  octenerEmpleados(){
    this.usuariosSucursal.length = 0
    this.sucursalInyectable.octenerSucursales(this.token).subscribe(sucursales => {
      this.sucurdales = sucursales;
      this.sucurdales.map(sucursal => {
        this.sucursalInyectable.octenerUsuarioSucursal(sucursal.idSucursal,this.token).subscribe(usuario => {
          this.usuariosSucursal.push({"nombre":sucursal.nombre,"direccion":sucursal.direccion,"usuarios":usuario})
        })
      })
    }, (res) => {
      if(res.codigo == 3){
        notify(res.mensaje ,"danger");
        setTimeout(()=>{
          this.router.navigate(['login']);
        },1000)
      }
    });
  }
  
}
