import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { notify } from "../../notificaciones/notify";
import { NgxSpinnerService } from "ngx-spinner";
import { VentasService } from "app/services/ventas.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

@Component({
  selector: "app-modal-devoluciones",
  templateUrl: "./modal-devoluciones.component.html",
  styleUrls: ["./modal-devoluciones.component.css"],
})
export class ModalDevolucionesComponent implements OnInit {
  @ViewChild("matPaginatorMedicamento", { read: MatPaginator })
  paginatorMedicamento: MatPaginator;
  @ViewChild("matPaginatorAbarrotes", { read: MatPaginator })
  paginatorAbarrotes: MatPaginator;
  @ViewChild("matPaginatorCosmeticos", { read: MatPaginator })
  paginatorCosmeticos: MatPaginator;

  dataSourceMedicamento = new MatTableDataSource<any>();
  dataSourceAbarrotes = new MatTableDataSource<any>();
  dataSourceCosmeticos = new MatTableDataSource<any>();

  token: string;
  venta: any;
  caduco: boolean = true;
  productosDevueltos: any[] = [];
  productos: any[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private ventaService: VentasService,
    public dialogRef: MatDialogRef<ModalDevolucionesComponent>,
  ) {}

  productosMedicamento: string[] = [
    "codigo",
    "marcaComercial",
    "descripcion",
    "sustancia",
    "cantidad",
    "opciones",
  ];

  productosAbarrote: string[] = [
    "codigo",
    "nombre",
    "descripcion",
    "marca",
    "cantidad",
    "opciones",
  ];

  productosCosmetico: string[] = [
    "codigo",
    "nombre",
    "descripcion",
    "marca",
    "cantidad",
    "opciones",
  ];

  ngOnInit(): void {
    this.token = localStorage.getItem("token");
  }

  buscarVenta(ev) {
    this.spinner.show();
    let datos: any = localStorage.getItem("datosUser");
    datos = JSON.parse(datos);
    this.ventaService
      .octenerVenta(this.token, ev.value, datos.idSucursal)
      .subscribe((res) => {
        console.log(res);
        if (res.codigo == "0") {
          this.caduco = false;
          this.venta = res;
          setTimeout(() => {
            this.dataSourceMedicamento = new MatTableDataSource(
              res.productosMedicamento
            );
            this.dataSourceAbarrotes = new MatTableDataSource(
              res.productosAbarrote
            );
            this.dataSourceCosmeticos = new MatTableDataSource(
              res.productosCosmetico
            );
            this.dataSourceMedicamento.paginator = this.paginatorMedicamento;
            this.dataSourceAbarrotes.paginator = this.paginatorAbarrotes;
            this.dataSourceCosmeticos.paginator = this.paginatorCosmeticos;
            this.spinner.hide();
          }, 400);
        } else if (res.codigo == "5") {
          notify(res.mensaje, "danger");
          this.spinner.hide();
        }
      });
  }

  onClick() {
    if (this.productosDevueltos.length == 0) {
      notify("No a seleccionado ningun producto.", "danger");
      return;
    }

    this.spinner.show();
    //console.log(this.venta);

    this.venta.productosMedicamento.map((item, index) => {
      let medicamentoIndex = false;
      for (let i = 0; i < this.productosDevueltos.length; i++) {
        if (this.productosDevueltos[i] == item.codigo) {
          medicamentoIndex = true;
        }
      }
      if (!medicamentoIndex) {
        this.productos.push({ codigo: item.codigo, cantidad: item.cantidad });
      }
    });
    this.venta.productosAbarrote.map((item, index) => {
      let abarroteIndex = false;
      for (let i = 0; i < this.productosDevueltos.length; i++) {
        if (this.productosDevueltos[i] == item.codigo) {
          abarroteIndex = true;
        }
      }
      if (!abarroteIndex) {
        this.productos.push({ codigo: item.codigo, cantidad: item.cantidad });
      }
    });
    this.venta.productosCosmetico.map((item, index) => {
      let cosmeticosIndex = false;
      for (let i = 0; i < this.productosDevueltos.length; i++) {
        if (this.productosDevueltos[i] == item.codigo) {
          cosmeticosIndex = true;
        }
      }
      if (!cosmeticosIndex) {
        this.productos.push({ codigo: item.codigo, cantidad: item.cantidad });
      }
    });

    this.dialogRef.close({
      productos: this.productos,
      total: this.venta.total,
      idVenta: this.venta.idVenta,
      tipo: "devolucion"
    })

    setTimeout(() => {
      this.spinner.hide();
    }, 400);
  }

  onChange(event) {
    if (event.checked) {
      this.productosDevueltos.push(event.source.value);
    } else {
      const i = this.productosDevueltos.findIndex(
        (x) => x === event.source.value
      );
      this.productosDevueltos.splice(i, 1);
    }
    console.log(this.productosDevueltos);
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
