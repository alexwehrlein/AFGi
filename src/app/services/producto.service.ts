import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Producto } from "../models/producto";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class ProductoService {
    producto: Producto = new Producto();

    constructor(private http: HttpClient) {}

    registrarProducto(producto: Producto, token, url): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.post<any>(environment.URL + "producto/" + url, producto, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    registrarTraspaso(lista: any, token): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.post<any>(environment.URL + "producto/porBodega", lista, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    actualizarProducto(producto: any, token, url, codigo): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .put<any>(environment.URL + "producto/" + url + "/" + codigo, producto, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    octenrtProductos(token, url): Observable<Producto[]> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Producto[]>(environment.URL + "producto/" + url, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    octenrtProductosSucursal(token, url, idSucursal): Observable<Producto[]> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Producto[]>(environment.URL + "producto/porSucursal/" + url+"/"+idSucursal, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    compraProductos(productos, token): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.post<any>(environment.URL + "producto/compra", productos, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    actualizarPrecioProducto(producto, token): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.put<any>(environment.URL + `producto/actualizaPrecio/${producto.codigo}/${producto.precioVenta}`, producto , headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    async getProductosBodega(token){
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        let productos:Producto[] = [];
        let bodega:any = {};
        let medicamento = await this.http.get<Producto[]>(environment.URL + "producto/medicamento", headers).toPromise();
        let abarrote = await this.http.get<Producto[]>(environment.URL + "producto/abarrote", headers).toPromise();
        let cosmetico = await this.http.get<Producto[]>(environment.URL + "producto/cosmetico", headers).toPromise();
        productos.push(...medicamento);
        productos.push(...abarrote);
        productos.push(...cosmetico);
        bodega.medicamento = medicamento;
        bodega.abarrote = abarrote;
        bodega.cosmetico = cosmetico;
        bodega.productos = productos;
        return bodega;
    }

    async getAsyncProductosSucursales(token, idSucursal) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        let productos:Producto[] = [];
        let medicamento = await this.http.get<Producto[]>(environment.URL + "producto/porSucursal/medicamento/"+idSucursal, headers).toPromise();
        let abarrote = await this.http.get<Producto[]>(environment.URL + "producto/porSucursal/abarrote/"+idSucursal, headers).toPromise();
        let cosmetico = await this.http.get<Producto[]>(environment.URL + "producto/porSucursal/cosmetico/"+idSucursal, headers).toPromise();
        productos.push(...medicamento);
        productos.push(...abarrote);
        productos.push(...cosmetico);
        return productos;
      }


}
