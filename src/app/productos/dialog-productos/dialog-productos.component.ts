import { Component, OnInit , Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { notify } from '../../notificaciones/notify';

export interface DialogData {
  precioCompra: number;
  precioVenta: number ;
  cantidad: number ;
  codigo:string
}

@Component({
  selector: 'app-dialog-productos',
  templateUrl: './dialog-productos.component.html',
  styleUrls: ['./dialog-productos.component.css']
})
export class DialogProductosComponent implements OnInit {

  
  constructor(public dialogRef: MatDialogRef<DialogProductosComponent>,
  @Inject(MAT_DIALOG_DATA) public data:DialogData ) { }

  ngOnInit(): void {
  }

  onClick(data:DialogData):void{
    //console.log(data)
    if(data.precioCompra == undefined){
      notify("Ingresar un precio de compra." ,"danger");
      return
    }
   

    if(data.precioVenta == undefined){
      notify("Ingresar un precio de venta." ,"danger");
      return
    }
   

    if(data.cantidad == undefined){
      notify("Ingresar una cantidad." ,"danger");
      return
    }
   
    if(data.cantidad <= 0){
      notify("Ingresar un cantidad mayor a 0." ,"danger");
      return
    }

    let listaCompra:any = localStorage.getItem("listaCompra");
    listaCompra = JSON.parse(listaCompra);


    if (listaCompra == null || listaCompra == 'null') {
      listaCompra = []
    }

    let indexProducto = listaCompra.filter(producto => producto.codigo == data.codigo);
    
    if (indexProducto.length > 0) {
      //let index = listaCompra.indexOf(data.codigo);
      //listaCompra[index].cantidad = data.cantidad
      this.dialogRef.close();
      notify("Ya se agrego este producto en la compra." ,"danger");
      return
    }else{
      listaCompra.push(data)
    }

    localStorage.setItem("listaCompra", JSON.stringify(listaCompra));

    this.dialogRef.close();

  }

validarNumero(event){
    var out = '';
    var filtro = '1234567890.';
    
    for (var i=0; i<event.target.value.length; i++)
       if (filtro.indexOf(event.target.value.charAt(i)) != -1) 
             
          out += event.target.value.charAt(i);
    
      event.target.value = out;
}


}
