import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { notify } from 'app/notificaciones/notify';
import { ClientesService } from 'app/services/clientes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Cliente } from "../../models/cliente";

@Component({
  selector: 'app-modal-descuentos',
  templateUrl: './modal-descuentos.component.html',
  styleUrls: ['./modal-descuentos.component.css']
})
export class ModalDescuentosComponent implements OnInit {

  clientes:Cliente[] = [];
  idCliente:number;
  cliente: Cliente = new Cliente();
  token:string;

  constructor( public dialogRef: MatDialogRef<ModalDescuentosComponent>,
    private clienteService:ClientesService,
    private spinner: NgxSpinnerService,
    ) { }

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
    this.clienteService.octenerTodosLosClientes(this.token).subscribe( res => {
      this.clientes = res;
    })
  }

  onChange(id){
    this.spinner.show();
    this.clienteService.octenerCliente(id , this.token ).subscribe( res => {
      this.cliente = res;
      this.spinner.hide();
    })
  }

  onClickCliente(){
    if( Object.keys(this.cliente).length == 0){
      notify("Seleccione un cliente.", "danger");
      return;
    }
    this.dialogRef.close({ data: this.cliente });
  }
  

}
