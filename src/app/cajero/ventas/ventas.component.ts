import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Producto } from "app/models/producto";
import { notify } from "app/notificaciones/notify";
import { ProductoService } from "app/services/producto.service";
import { VentasService } from "app/services/ventas.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Cliente } from "../../models/cliente";
import { ModalDescuentosComponent } from "../modal-descuentos/modal-descuentos.component";
import { ModelInfoProductoComponent } from "../model-info-producto/model-info-producto.component";
import { ModelConsultorioComponent } from "../model-consultorio/model-consultorio.component";
import { ModalDevolucionesComponent } from "../modal-devoluciones/modal-devoluciones.component";
import { ModalVentaComponent } from "../modal-venta/modal-venta.component";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import {map, startWith} from 'rxjs/operators';
import * as moment from 'moment';

export interface ProductoVentaInterface {
  codigo: string;
  descripcion: string;
  marcaComercial: string;
  sustancia: string;
  laboratorio: string;
  tipoMedicamento: string;
  nombre: string;
  marca: string;
  cantidadVenta: number;
  precio: number;
  total: number;
  cantidadDevolucion:number
}

@Component({
  selector: "app-ventas",
  templateUrl: "./ventas.component.html",
  styleUrls: ["./ventas.component.css"],
})
export class VentasComponent implements OnInit {
  productos: Producto[] = [];
  ventasPausadas:any[] = [];
  productosVenta: ProductoVentaInterface[] = [];
  token: string;
  total: number = 0;
  totalPatente: number = 0;
  totalGenerico: number = 0;
  totalMaterialCuracio: number = 0;
  totalPatenteDes: number = 0;
  totalGenericoDes: number = 0;
  totalMaterialCuracioDes: number = 0;
  totalPAC: number = 0; //total de abarrotes y cosmeticos
  cliente: Cliente = new Cliente();
  idVenta:number = 0;
  totalDevolucion:number = 0;
  tipoVenta:string = "venta";
  myControl = new FormControl();
  filteredOptions: Observable<Producto[]>;
  datosUser:any;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private ventaService: VentasService
  ) {}

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
    if (this.token == null) {
      this.router.navigate(["login"]);
    }
    let datos: any = localStorage.getItem("datosUser");
    this.datosUser = JSON.parse(datos);

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    
    //this.octenerProductos();
    this.octenerTodosLosProductos();
    this.octenerVentasPausadas();
  }

  private _filter(value: string): Producto[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  octenerTodosLosProductos(){
    console.log("cargando... Productos");
    this.spinner.show();
    let productos = this.productoService.getAsyncProductosSucursales(this.token,this.datosUser.idSucursal);
    productos.then(res => {
      console.log("productos cargados");
      this.spinner.hide();
      this.productos = res;
    }).catch(err => {
      console.error(err);
      this.spinner.hide();
    })
  }

  octenerProductos() {
    console.log("se llamo a productos");
    let datosUser: any = localStorage.getItem("datosUser");
    datosUser = JSON.parse(datosUser);

    this.productos.length = 0;

    this.productoService
      .octenrtProductosSucursal(this.token, "medicamento", datosUser.idSucursal)
      .subscribe(
        (res) => {
          this.productos.push(...res);
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

    this.productoService
      .octenrtProductosSucursal(this.token, "abarrote", datosUser.idSucursal)
      .subscribe(
        (res) => {
          this.productos.push(...res);
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

    this.productoService
      .octenrtProductosSucursal(this.token, "cosmetico", datosUser.idSucursal)
      .subscribe(
        (res) => {
          this.productos.push(...res);
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

  octenerVentasPausadas(){
    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);

    this.ventaService.octenerVentasPausadas(datos.idSucursal , this.token).subscribe(res => {
        this.ventasPausadas = res;
    })
  }

  descuentos() {
    if (this.productosVenta.length == 0) {
      notify("Agrregar articulos para poder usar los descuentos.", "danger");
      return;
    }
    const dialogRef = this.dialog.open(ModalDescuentosComponent, {
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != "") {
        this.cliente = result.data;
        this.totalVenta();
      }
    });
  }

  consultorio(){
    const dialogRef = this.dialog.open(ModelConsultorioComponent, {
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      if(result.data === true){
          this.ticketConsultorio(result);
          setTimeout(() => {
            this.ticketConsultorio(result);
          }, 500);
      }
    });
  }

  ticketConsultorio(result:any){
    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        var f = new Date();
        let ticket = `
        <div style="font-size:13px;">
        <div style="margin-top: -44px; margin-bottom: -35px;text-align: center;" class="logo-img">
          <img  style="width: 132px;" src="./assets/img/logo-gi.png"/>
        </div>
        <p>FARMACIAS GI</p>
        <p style="margin-top:-15px;">Iguala de la Independencia</p>
        <p style="margin-top:-15px;">${this.datosUser.sucursal}</p>
        <p style="margin-top:-15px;">TIPO:   ${result.tipo}</p>
        <p style="margin-top:-15px;">TURNO:  <span style="font-size:18px;">${result.turno}</span> </p>
        <p style="margin-top:-15px;">Fecha:  ${f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()} </p>
        <p style="margin-top:-15px;">==========================================</p>
        <div style="text-align: center;">
        <p style="margin-top:-15px;">¡Gracias por su compra!</p>
        <p style="margin-top:-15px;">¡Expertos en tu salud!</p>
        </div>
        </div>
        `;

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(ticket);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
  }

  totalVenta() {
    //se calcula el total de la venta

    this.totalGenerico = this.productosVenta.reduce((totalVenta, art) => {
      if (art.tipoMedicamento === "generico") {
        return totalVenta + art.total;
      }
      return totalVenta;
    }, 0);

    this.totalPatente = this.productosVenta.reduce((totalVenta, art) => {
      if (art.tipoMedicamento === "patente") {
        return totalVenta + art.total;
      }
      return totalVenta;
    }, 0);

    this.totalMaterialCuracio = this.productosVenta.reduce(
      (totalVenta, art) => {
        if (art.tipoMedicamento === "material") {
          return totalVenta + art.total;
        }
        return totalVenta;
      },
      0
    );

    this.totalPAC = this.productosVenta.reduce((totalVenta, art) => {
      if (art.tipoMedicamento == null) {
        return totalVenta + art.total;
      }
      return totalVenta;
    }, 0);

    if (Object.keys(this.cliente).length != 0) {
      console.log(this.cliente);

      this.totalGenericoDes =
        (this.totalGenerico / 100) * parseInt(this.cliente.descuentoGenerico);
      this.totalPatenteDes =
        (this.totalPatente / 100) * parseInt(this.cliente.descuentoMaterial);
      this.totalMaterialCuracio =
        (this.totalMaterialCuracioDes / 100) *
        parseInt(this.cliente.descuentoMaterial);

      //console.log(this.totalGenericoDes + " generico Des");
      //console.log(this.totalPatenteDes + "Patente des");
      //console.log(this.totalMaterialCuracioDes + " materila");

      this.totalGenerico = this.totalGenerico - this.totalGenericoDes;
      this.totalPatente = this.totalPatente - this.totalPatenteDes;
      this.totalMaterialCuracio =
        this.totalMaterialCuracio - this.totalMaterialCuracioDes;

      this.total =
        this.totalPAC +
        this.totalGenerico +
        this.totalPatente +
        this.totalMaterialCuracio;
    } else {
      this.total = this.productosVenta.reduce(
        (totalVenta, art) => totalVenta + (art.precio * art.cantidadVenta ),
        0
      );
    }

    //console.log(this.totalGenerico + " generico");
    //console.log(this.totalPatente + " patente");
    //console.log(this.totalMaterialCuracio + " material");
    //console.log(this.totalPAC + " lo demas ");
    console.log(this.productosVenta);
  }

  buscarCodigo(ev) {
    let art: Producto = this.productos.find((res) => res.codigo == ev.value);

    if (art === undefined) {
      notify("No exite el articulo.", "danger");
      ev.value = "";
      return;
    }

    if (art.cantidad <= 0) {
      notify("No hay inventario del producto.", "danger");
      ev.value = "";
      return;
    }

    this.agregrarProductos(art , 1 , 0, ev);

    console.log(art);
    ev.value = "";
    document.getElementById("searchProducto").focus();
  }

  pausarVenta() {

    if (this.productosVenta.length == 0) {
      notify("No hay articulos agregados..", "danger");
      return;
    }

    this.spinner.show();

    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);

    let productos = [];

    this.productosVenta.map( art => {
      productos.push({
        "codigo":art.codigo,
        "precio": art.precio,
        "cantidad": art.cantidadVenta
      })
    })

    let venta: any = {
      "idEmpleado":datos.idEmpleado,
      "idCliente": (Object.keys(this.cliente).length == 0)? 47 : this.cliente.idCliente,
      "idSucursal": datos.idSucursal,
      "productosVenta": productos
    };

    this.ventaService.guardarVentaPausada(venta, this.token).subscribe(
      (res) => {
        console.log(res);
        this.spinner.hide();
        if(res.codigo == "0"){
          this.octenerVentasPausadas();
          this.limpiarVenta();
          notify(res.mensaje, "success");
        }else if(res.codigo == "500"){
          notify(res.mensaje, "danger");
        }
      },
      (res) => {
        this.spinner.hide();
        if (res.codigo == 3) {
          notify(res.mensaje, "danger");
          setTimeout(() => {
            this.router.navigate(["login"]);
          }, 1000);
        }
      }
    );
  }

  limpiarVenta() {
    //this.octenerProductos();
    this.productosVenta.length = 0;
    this.total = 0;
    this.totalPatente = 0;
    this.totalGenerico = 0;
    this.totalMaterialCuracio = 0;
    this.totalPatenteDes = 0;
    this.totalGenericoDes = 0;
    this.totalMaterialCuracioDes = 0;
    this.totalPAC = 0; //total de abarrotes y cosmeticos
    this.cliente = new Cliente();
    this.idVenta = 0;
    this.totalDevolucion = 0;
    this.tipoVenta = "venta";
    document.getElementById("searchProducto").focus();
  }

  infoProducto(){
    const dialogRef = this.dialog.open(ModelInfoProductoComponent, {
      width: "700px",
      disableClose: true,
      data: { productos:this.productos}
    });
  }

  eliminarVentaPausada(id){
    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);

    this.ventaService.eliminarVentaPausada(id , datos.idSucursal , this.token).subscribe( res => {
      this.octenerVentasPausadas();
    })
  }

  venta(cambio , importe){

    this.spinner.show();

    let productos = [];

    this.productosVenta.map( art => {
      productos.push({
        "codigo":art.codigo,
        "precio": art.precio,
        "cantidad": art.cantidadVenta
      })
    })

    let venta: any = {
      "idVenta": (this.tipoVenta == "devolucion")? 0 : this.idVenta,
      "idEmpleado":this.datosUser.idEmpleado,
      "idCliente": (Object.keys(this.cliente).length == 0)? 47 : this.cliente.idCliente,
      "idSucursal": this.datosUser.idSucursal,
      "productosVenta": productos
    };

    if(this.tipoVenta == "devolucion"){
      this.ventaService.devolucion(this.token , this.idVenta ,this.datosUser.idSucursal ).subscribe(res => {
        this.ventaService.guardarVenta(venta, this.token).subscribe(
          (res) => {
            //console.log(res);
            if(res.codigo == "0"){
              this.spinner.hide();
              this.octenerTodosLosProductos();
              //this.octenerProductos();
              this.octenerVentasPausadas();
              this.ticketVenta(res.idVenta,this.datosUser.nombre,cambio,importe);
              notify(res.mensaje, "success");
            }else if(res.codigo == "500"){
              this.spinner.hide();
              notify(res.mensaje, "danger");
            }
          },
          (res) => {
            this.spinner.hide();
            if (res.codigo == 3) {
              notify(res.mensaje, "danger");
              setTimeout(() => {
                this.router.navigate(["login"]);
              }, 1000);
            }
          }
        );
      });
    }else{
      this.ventaService.guardarVenta(venta, this.token).subscribe(
        (res) => {
          //console.log(res);
          if(res.codigo == "0"){
            //this.octenerProductos();
            this.spinner.hide();
            this.octenerTodosLosProductos();
            this.octenerVentasPausadas();
            this.ticketVenta(res.idVenta,this.datosUser.nombre,cambio,importe);
            notify(res.mensaje, "success");
          }else if(res.codigo == "500"){
            this.spinner.hide();
            notify(res.mensaje, "danger");
          }
        },
        (res) => {
          this.spinner.hide();
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

  ticketVenta(folio,empleado,cambio,importe){

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');
        var f = new Date();
        let ticket = `
        <div style="font-size:13px;">
        <div style="margin-top: -44px; margin-bottom: -35px;text-align: center;" class="logo-img">
          <img  style="width: 132px;" src="./assets/img/logo-gi.png"/>
        </div>
        <p>COMPROBANTE DE VENTA</p>
        <p style="margin-top:-15px;">FARMACIAS GI</p>
        <p style="margin-top:-15px;">${this.datosUser.sucursal}</p>
        <p style="margin-top:-15px;">Iguala de la Independencia</p>
        <p style="margin-top:-15px;">Folio:   ${folio}</p>
        <p style="margin-top:-15px;">Le atendio:  ${empleado} </p>
        <p style="margin-top:-15px;">Fecha:  ${f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear()} </p>
        <p style="margin-top:-15px;">Cliente:  ${this.cliente.idCliente != null ? this.cliente.nombre:"Publico en General"} </p>
        <p style="margin-top:-15px;">==========================================</p>`
        
        ticket += `
        <table style="margin-top:-20px;margin-bottom:-8px">
        <tr>
          <th style="font-size:small;">Cant</th>
          <th style="width:200px;text-align:left;font-size:small;">Descripcion</th>
          <th style="font-size:small;">Precio</th>
          <th style="font-size:small;">Importe</th>
        </tr>`
        this.productosVenta.map(item => {
          ticket +=`<tr>
          <td>${item.cantidadVenta}</td>  
          <td>${item.descripcion.slice(0,17)}</td>  
          <td>${item.precio}</td>   
          <td>${item.precio * item.cantidadVenta}</td>
          </tr>`
        })
      ticket += `</table><br>`
        
        ticket += `<p style="margin-top:-15px;">==========================================</p>
        <p style="margin-top:-15px;">TOTAL:              <span style="margin-left:61px;">$ ${this.total}</span></p>
        <p style="margin-top:-15px;">PAGO CLIENTE:       <span style="margin-left:11px;">$ ${importe}</span></p>
        <p style="margin-top:-15px;">CAMBIO:             <span style="margin-left:50px;">$ ${cambio.toFixed(2)}</span></p>
        <p style="margin-top:-15px;display:${this.cliente.idCliente == null  ? "none" : "block"}">Usted se ahorro con descuento $: ${(this.totalPatenteDes + this.totalMaterialCuracioDes + this.totalGenericoDes)}</p>
        <div style="text-align: center;">
        <p style="margin-top:-15px;">¡Gracias por su compra!</p>
        <p style="margin-top:-15px;">Las devoluciones se realizan unicamente</p>
        <p style="margin-top:-15px;">por otro producto, no se hace reembolso</p>
        <p style="margin-top:-15px;">del dinero, el periodo de la devolucion</p>
        <p style="margin-top:-15px;">es de 7 dias naturales</p>
        <p style="margin-top:-15px;">¡Conserve su ticket!</p>
        </div>
        </div>
        `;

        mywindow.document.write('<html><head><title>' + document.title  + '</title>');
        mywindow.document.write('</head><body >');
        mywindow.document.write(ticket);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        this.limpiarVenta();
  }

  retornarVentaPausada(art:any){
    this.limpiarVenta();
    console.log(art);
    this.idVenta = art.idVenta;
    this.spinner.show();
    art.productos.map(pausa => {
      let art: Producto = this.productos.find((res) => res.codigo == pausa.codigo);
      if(art != undefined || art.cantidad > 0 ){
        this.agregrarProductos( art , pausa.cantidad , 0);
      }
    })
    this.spinner.hide();
  }

  agregrarProductos(art , cantidadagregar , cantidadDevolucion ,  ev?){
    let artVenta = this.productosVenta.findIndex(
      (producto) => producto.codigo == art.codigo
    );

    if (artVenta === -1) {

      let artElejido: ProductoVentaInterface = {
        codigo: art.codigo,
        descripcion: art.descripcion,
        marcaComercial: art.marcaComercial,
        sustancia: art.sustancia,
        laboratorio: art.laboratorio,
        nombre: art.nombre,
        marca: art.marcaComercial,
        cantidadVenta: cantidadagregar,//
        precio: art.precio,
        total: art.precio * cantidadagregar, //
        tipoMedicamento: art.tipoMedicamento,
        cantidadDevolucion:cantidadDevolucion
      };
      this.productosVenta.push(artElejido);
    } else {
      let cantidadLlevada: number = this.productosVenta[artVenta].cantidadVenta;
      cantidadLlevada = cantidadLlevada + 1;

      let catidadConDevolucion:number = (art.cantidad +  this.productosVenta[artVenta].cantidadDevolucion)
      console.log(cantidadLlevada);
      console.log(catidadConDevolucion);
      if (cantidadLlevada > catidadConDevolucion) {
        notify(
          "No se cuenta con el  inventario suficiente del producto. " ,
          "danger"
        );
        ev.value = "";
        return;
      }
      
      this.productosVenta[artVenta].cantidadVenta = cantidadLlevada;
      let total = this.productosVenta[artVenta].total;
      this.productosVenta[artVenta].total = total + art.precio;
    }

    this.totalVenta();
  }

  devolucion(){
    this.limpiarVenta();
    const dialogRef = this.dialog.open(ModalDevolucionesComponent, {
      width: "80%",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result != null){
        this.totalDevolucion =  result.total;
        this.tipoVenta = result.tipo;
        this.idVenta = result.idVenta;
        result.productos.map( result => {
          let art: Producto = this.productos.find((res) => res.codigo == result.codigo);
          this.agregrarProductos(art , result.cantidad , result.cantidad )
        })
      }
    });
  }

  onChangeCantidad(ev){
    let index = ev.target.getAttribute("data-index");
    let codigo = ev.target.getAttribute("data-codigo");
    let cantidadDevolucion:number = parseInt(ev.target.getAttribute("data-devolucion"));
    let art: Producto = this.productos.find((res) => res.codigo == codigo);
    let cantidad:number = parseInt(ev.target.value);
    let cantidadFinal:number = (art.cantidad + cantidadDevolucion)

    if (cantidad > cantidadFinal) {
      notify(
        "No se cuenta con el  inventario suficiente del producto. " ,
        "danger"
      );
      ev.target.value = cantidad - 1;
      return;
    }

    this.productosVenta[index].total = cantidad * art.precio;
    this.productosVenta[index].cantidadVenta = cantidad;
    this.totalVenta();
}

  eliminarProducto(index){
  this.productosVenta.splice(index,1);
  this.totalVenta();
}

  modalVenta(){
  
  if (this.productosVenta.length == 0) {
    notify("No hay articulos agregados..", "danger");
    return;
  }

  if(this.tipoVenta == "devolucion"){
      if(this.total < this.totalDevolucion ){
        notify("El monto tiene que ser igual o mayor al total de la devolucion" , "danger");
        return;
      }
  }

  var currentTime= moment();
  var startTime = moment('08:00 am', "HH:mm a");
  var endTime = moment('10:00 pm', "HH:mm a");
  let amIBetween = currentTime.isBetween(startTime , endTime); 

  if(!amIBetween){
    notify("Horario no disponible para ventas" , "danger");
    return;
  }

  const dialogRef = this.dialog.open(ModalVentaComponent, {
    width: "30%",
    disableClose: true,
    data: { total: this.total}
  });

  dialogRef.afterClosed().subscribe((result) => {
    console.log(result);
    if(result.data === false){
      this.venta(result.cambio , result.importe);
    }
  });
}

actualizarProductos(){
  this.octenerTodosLosProductos();
}

}
