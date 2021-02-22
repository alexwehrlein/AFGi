import { Component, OnInit, ViewChild } from "@angular/core";
import { notify } from "../notificaciones/notify";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Producto } from "../models/producto";
import { ProductoService } from "../services/producto.service";
import { ProveedorService } from "../services/proveedor.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogProductosComponent } from "./dialog-productos/dialog-productos.component";
import { DialogProductosUpdateComponent } from "./dialog-productos-update/dialog-productos-update.component";
import { DialogProductosTrasferenciaComponent } from "./dialog-productos-trasferencia/dialog-productos-trasferencia.component";
import { ModalPrecioProductoComponent } from "./modal-precio-producto/modal-precio-producto.component";
import { Proveedor } from "../models/proveedor";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Sucursal } from "../models/sucursal";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
    selector: "app-productos",
    templateUrl: "./productos.component.html",
    styleUrls: ["./productos.component.css"],
})
export class ProductosComponent implements OnInit {
    @ViewChild("matPaginator", { read: MatPaginator }) paginator: MatPaginator;
    @ViewChild("matPaginatorG", { read: MatPaginator }) paginatorG: MatPaginator;
    @ViewChild("paginatorCompra", { read: MatPaginator })
    paginatorCompra: MatPaginator;

    @ViewChild("matSourceMedicamento", { read: MatPaginator })
    paginatorMedicamento: MatPaginator;
    @ViewChild("matAbarrotes", { read: MatPaginator })
    paginatorAbarrotes: MatPaginator;
    @ViewChild("matSourcePerfumeria", { read: MatPaginator })
    paginatorPerfumeria: MatPaginator;
    @ViewChild("matSourceTraspaso", { read: MatPaginator })
    paginatorTraspaso: MatPaginator;
    sucurdales: Array<Sucursal> = new Array<Sucursal>();
    proveedores: Array<Proveedor> = new Array<Proveedor>();
    medicamento: boolean = true;
    abarrote: boolean = false;
    cosmetico: boolean = false;
    tipo: string = "medicamento";
    selected = "medicamento";
    formularioProductos: FormGroup;
    producto: Producto = new Producto();
    token: string;
    precioCompra: number;
    precioVenta: number;
    cantidad: number;
    codigo: string;
    productosTraspaso: Array<any> = new Array<any>();
    productosCompra: Array<any> = new Array<any>();
    ELEMENT_DATA: Array<Producto> = new Array<Producto>();
    ELEMENT_DATA_MEDICAMENTO: Array<Producto> = new Array<Producto>();
    ELEMENT_DATA_ABARROTES: Array<Producto> = new Array<Producto>();
    ELEMENT_DATA_COSMETICOS: Array<Producto> = new Array<Producto>();
    dataSource;
    dataSourceCompra;
    dataSourceTraspaso;
    dataSourceG;
    idProveedor: number = 0;
    dataSourceMedicamento;
    dataSourceAbarrotes;
    dataSourcePerfumeria;

    constructor(
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private router: Router,
        private productoInyectable: ProductoService,
        private proveedoresInyectable: ProveedorService,
        private spinner: NgxSpinnerService,
    ) {}

    displayedColumns: string[] = ["codigo", "nombre", "descripcion", "agregar"];

    displayedColumnsTraspaso: string[] = ["codigo", "nombre", "sucursales", "opciones"];

    displayedColumns2: string[] = ["codigo", "precioVenta", "cantidad", "eliminar"];
    displayedColumnsMedicamento: string[] = [
        "codigo",
        "descripcion",
        "sustancia",
        "laboratorio",
        "tipoMedicamento",
        "cantidad",
        "precio",
        "editar",
    ];
    displayedColumnsAbarrotes: string[] = [
        "codigo",
        "descripcion",
        "nombre",
        "marca",
        "cantidad",
        "precio",
        "editar",
    ];
    displayedColumnsCosmeticos: string[] = [
        "codigo",
        "descripcion",
        "nombre",
        "marca",
        "laboratorio",
        "cantidad",
        "precio",
        "editar",
    ];
    //dataSource = this.ELEMENT_DATA;
    ngAfterViewInit() {
        this.dataSourceCompra.paginator = this.paginatorCompra;
        this.dataSourceTraspaso.paginator = this.paginatorTraspaso;
    }

    ngOnInit(): void {
        this.token = localStorage.getItem("token");
        if (this.token == null) {
            this.router.navigate(["login"]);
        }
        this.formularioProductos = this.formBuilder.group({
            tipo: ["medicamento", Validators.required],
            codigo: ["", Validators.required],
            descripcion: ["", Validators.required],
            nombre: [""],
            marcaComercial: [""],
            marca: [""],
            laboratorio: [""],
            sustancia: [""],
            tipoMedicamento: [""],
        });

        this.octenerListaTraspaso();
        this.octenerListaCompra();
        this.octenerProductos();
        this.octenerProveederos();
        this.dataSourceCompra = new MatTableDataSource(this.productosCompra);
        this.dataSourceTraspaso = new MatTableDataSource(this.productosTraspaso);
    }

    octenerProductos() {
        this.ELEMENT_DATA.length = 0;
        this.productoInyectable.octenrtProductos(this.token, "medicamento").subscribe(
            (productos) => {
                this.ELEMENT_DATA = this.ELEMENT_DATA.concat(productos);

                this.ELEMENT_DATA_MEDICAMENTO = productos;
                this.dataSourceMedicamento = new MatTableDataSource(this.ELEMENT_DATA_MEDICAMENTO);
                this.dataSourceMedicamento.paginator = this.paginatorMedicamento;
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
        this.productoInyectable.octenrtProductos(this.token, "abarrote").subscribe(
            (productos) => {
                this.ELEMENT_DATA = this.ELEMENT_DATA.concat(productos);

                this.ELEMENT_DATA_ABARROTES = productos;
                this.dataSourceAbarrotes = new MatTableDataSource(this.ELEMENT_DATA_ABARROTES);
                this.dataSourceAbarrotes.paginator = this.paginatorAbarrotes;
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
        this.productoInyectable.octenrtProductos(this.token, "cosmetico").subscribe(
            (productos) => {
                this.ELEMENT_DATA = this.ELEMENT_DATA.concat(productos);
                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                this.dataSourceG = new MatTableDataSource(this.ELEMENT_DATA);
                this.dataSource.paginator = this.paginator;
                this.dataSourceG.paginator = this.paginatorG;
                this.dataSourceMedicamento.paginator = this.paginatorMedicamento;

                this.ELEMENT_DATA_COSMETICOS = productos;
                this.dataSourcePerfumeria = new MatTableDataSource(this.ELEMENT_DATA_COSMETICOS);
                this.dataSourcePerfumeria.paginator = this.paginatorPerfumeria;
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

    onChange(tipo) {
        this.tipo = tipo;
        if (tipo == "medicamento") {
            this.medicamento = true;
            this.abarrote = false;
            this.cosmetico = false;
        }
        if (tipo == "abarrote") {
            this.medicamento = false;
            this.abarrote = true;
            this.cosmetico = false;
        }
        if (tipo == "cosmetico") {
            this.medicamento = false;
            this.abarrote = false;
            this.cosmetico = true;
        }
    }

    agregar() {
        this.producto = this.formularioProductos.value as Producto;

        if (this.tipo == "medicamento") {
            if (this.formularioProductos.value.marcaComercial == "") {
                notify("Ingresar la marca comercial del medicamento.", "danger");
                return;
            }
            if (this.formularioProductos.value.laboratorio == "") {
                notify("Ingresar el laboratio del medicamento.", "danger");
                return;
            }
            if (this.formularioProductos.value.sustancia == "") {
                notify("Ingresar la sustancia del medicamento.", "danger");
                return;
            }
            if (this.formularioProductos.value.tipoMedicamento == "") {
                notify("Seleccionar tipo de medicamento.", "danger");
                return;
            }
            delete this.producto.nombre;
            delete this.producto.marca;
            delete this.producto.tipo;
        }

        if (this.tipo == "abarrote") {
            if (this.formularioProductos.value.marca == "") {
                notify("Ingresar la marca del producto.", "danger");
                return;
            }
            if (this.formularioProductos.value.nombre == "") {
                notify("Ingresar nombre del producto.", "danger");
                return;
            }
            delete this.producto.marcaComercial;
            delete this.producto.sustancia;
            delete this.producto.laboratorio;
            delete this.producto.tipoMedicamento;
            delete this.producto.tipo;
        }

        if (this.tipo == "cosmetico") {
            if (this.formularioProductos.value.marca == "") {
                notify("Ingresar la marca del producto.", "danger");
                return;
            }
            if (this.formularioProductos.value.nombre == "") {
                notify("Ingresar nombre del producto.", "danger");
                return;
            }
            if (this.formularioProductos.value.laboratorio == "") {
                notify("Ingresar el laboratio del cosmetico.", "danger");
                return;
            }
            delete this.producto.marcaComercial;
            delete this.producto.sustancia;
            delete this.producto.tipoMedicamento;
            delete this.producto.tipo;
        }

        this.productoInyectable.registrarProducto(this.producto, this.token, this.tipo).subscribe(
            (res) => {
                this.formularioProductos.reset();
                notify("El producto fue registro exitosamente", "success");
                this.octenerProductos();
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

    octenerProveederos() {
        this.proveedores.length = 0;
        this.proveedoresInyectable.octenerTodosLosProveedores(this.token).subscribe(
            (proveedores) => {
                this.proveedores = proveedores;
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

    octenerListaTraspaso() {
        let listaTraspaso: any = localStorage.getItem("listaTraspaso");
        listaTraspaso = JSON.parse(listaTraspaso);

        if (listaTraspaso == null || listaTraspaso == "null") {
            listaTraspaso = [];
        }

        this.productosTraspaso = listaTraspaso;
    }

    octenerListaCompra() {
        let listaCompra: any = localStorage.getItem("listaCompra");
        listaCompra = JSON.parse(listaCompra);

        if (listaCompra == null || listaCompra == "null") {
            listaCompra = [];
        }

        this.productosCompra = listaCompra;
    }

    openDialog(data: Producto): void {
        this.codigo = data.codigo;

        const dialogRef = this.dialog.open(DialogProductosComponent, {
            width: "450px",
            data: {
                codigo: this.codigo,
                precioCompra: this.precioCompra,
                precioVenta: this.precioVenta,
                cantidad: this.cantidad,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            //console.log(result)
            this.octenerListaCompra();
            this.dataSourceCompra.data = this.productosCompra;
        });
    }

    openDialogUpdate(data: Producto, tipo: number): void {
        if (tipo == 1) {
            localStorage.setItem("updateProductoTipo", "medicamento");
        } else if (tipo == 2) {
            localStorage.setItem("updateProductoTipo", "abarrote");
        } else if (tipo == 3) {
            localStorage.setItem("updateProductoTipo", "cosmetico");
        }

        const dialogRef = this.dialog.open(DialogProductosUpdateComponent, {
            width: "650px",
            data: {
                ...data,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == undefined) {
                this.octenerProductos();
            }
        });
    }

    openDialogCambiarPrecio(data: Producto):void{
        const dialogRef = this.dialog.open(ModalPrecioProductoComponent, {
            width: "400px",
            data: {
                ...data
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            //console.log(result)
            if (result == undefined) {
                this.octenerProductos();
            }
        });
    }

    openDialogTrasferencia(data: Producto): void {
        const dialogRef = this.dialog.open(DialogProductosTrasferenciaComponent, {
            width: "650px",
            data: {
                existencias: data.cantidad,
                codigo: data.codigo,
                nombre: data.descripcion,
                cantidad: [],
                index: -1,
                status: 0,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            //console.log(result)
            this.octenerListaTraspaso();
            this.dataSourceTraspaso.data = this.productosTraspaso;
        });
    }

    editarTraspaso(data: any, index: number) {
        const dialogRef = this.dialog.open(DialogProductosTrasferenciaComponent, {
            width: "650px",
            data: {
                existencias: data.existencias,
                codigo: data.codigo,
                nombre: data.descripcion,
                cantidad: data.pedido,
                index: index,
                status: 1,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            //console.log(result)
            this.octenerListaTraspaso();
            this.dataSourceTraspaso.data = this.productosTraspaso;
        });
    }

    eliminarProducto(index: number) {
        let listaCompra: any = localStorage.getItem("listaCompra");
        listaCompra = JSON.parse(listaCompra);
        listaCompra.splice(index, 1);
        localStorage.setItem("listaCompra", JSON.stringify(listaCompra));
        this.octenerListaCompra();
        this.dataSourceCompra.data = this.productosCompra;
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    applyFilterG(filterValue: string) {
        this.dataSourceG.filter = filterValue.trim().toLowerCase();
    }

    applyFilterMedicamento(filterValue: string) {
        this.dataSourceMedicamento.filter = filterValue.trim().toLowerCase();
    }

    applyFilterAbarrotes(filterValue: string) {
        this.dataSourceAbarrotes.filter = filterValue.trim().toLowerCase();
    }

    applyFilterCosmeticos(filterValue: string) {
        this.dataSourcePerfumeria.filter = filterValue.trim().toLowerCase();
    }
    applyFilterTraspaso(filterValue: string) {
        this.dataSourceTraspaso.filter = filterValue.trim().toLowerCase();
    }

    comprar() {

        let listaCompra: any = localStorage.getItem("listaCompra");
        listaCompra = JSON.parse(listaCompra);

        if (listaCompra == null || listaCompra == "null") {
            notify("No hay Productos para comprar", "danger");
            return;
        }

        if (this.idProveedor == 0) {
            notify("Elejir un proveedor.", "danger");
            return;
        }

        this.spinner.show();

        let data = {
            idProveedor: this.idProveedor,
            productosCompra: listaCompra,
        };

        //console.log(data)

        this.productoInyectable.compraProductos(data, this.token).subscribe(
            (productos) => {
                notify("La compra se realizo con exito.", "success");
                localStorage.removeItem("listaCompra");
                this.idProveedor = null;
                this.octenerListaCompra();
                this.octenerProductos();
                this.dataSourceCompra.data = this.productosCompra;
                this.spinner.hide();
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

    guardarTraspaso() {

        let listaTraspaso: any = localStorage.getItem("listaTraspasoServis");
        let listaTraspasoCompleto: any = localStorage.getItem("listaTraspaso");

        let sucursalesCantidad: any[] = [];

        listaTraspaso = JSON.parse(listaTraspaso);
        listaTraspasoCompleto = JSON.parse(listaTraspasoCompleto);

        if (listaTraspaso == null || listaTraspaso == "null") {
            listaTraspaso = [];
        }
        if (listaTraspasoCompleto == null || listaTraspasoCompleto == "null") {
            listaTraspasoCompleto = [];
        }

        if (listaTraspasoCompleto.length === 0) {
            notify("Ingrese productos para el traspaso.", "danger");
            return;
        }

        this.spinner.show();

        this.productoInyectable.registrarTraspaso(listaTraspaso, this.token).subscribe(
            (res) => {
                notify("El traspaso fue correcto. AVISAR A LAS FARMACIAS", "success");
                localStorage.setItem("listaTraspaso", "[]");
                localStorage.setItem("listaTraspasoServis", "[]");
                this.octenerProductos();
                this.octenerListaTraspaso();
                this.dataSourceTraspaso.data = this.productosTraspaso;
                this.spinner.hide();
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

    eliminarTraspasoProducto(index: number, produc: Producto) {
        let listaTraspaso: any = localStorage.getItem("listaTraspasoServis");
        let listaTraspasoCompleto: any = localStorage.getItem("listaTraspaso");
        listaTraspaso = JSON.parse(listaTraspaso);
        listaTraspasoCompleto = JSON.parse(listaTraspasoCompleto);

        listaTraspasoCompleto.splice(index, 1);
        localStorage.setItem("listaTraspaso", JSON.stringify(listaTraspasoCompleto));

        listaTraspaso.map((item, i) => {
            item.productosPP.map((producto, index) => {
                if (producto.codigo == produc.codigo) {
                    listaTraspaso[i].productosPP.splice(index, 1);
                }
            });
        });

        localStorage.setItem("listaTraspasoServis", JSON.stringify(listaTraspaso));

        this.octenerListaTraspaso();
        this.dataSourceTraspaso.data = this.productosTraspaso;
    }

    validarnombre(event){
        var out = '';
        var filtro = 'abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNÑOPQRSTUVWXYZàèìòùÜ-123456789 ';
        
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
