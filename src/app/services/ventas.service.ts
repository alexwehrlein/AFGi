import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";
import { Consultorio } from "../models/consultorio";

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient) { }

  guardarVentaPausada(venta: any, token: string): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.post<any>(environment.URL + "venta/pausa", venta, headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}
  eliminarVentaPausada(idVenta: number , idSucursal:number, token: string): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.delete<any>(environment.URL + `venta/pausa/${idVenta}/${idSucursal}`, headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}

  octenerVentasPausadas(idSucursal:number, token: string): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.get<any>(environment.URL + `venta/pausa/productos/${idSucursal}`, headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}

octenerProductosConsulta(token: string): Observable<Consultorio[]> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.get<Consultorio[]>(environment.URL + "venta/consultorio", headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}

ventaConsulta(token: string , venta): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.post<any>(environment.URL + "venta/consultorio", venta , headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}



guardarVenta(venta: any, token: string): Observable<any> {
  var headers = {
      headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
  };
  return this.http.post<any>(environment.URL + "venta", venta, headers).pipe(
      catchError((err) => {
          return throwError(err.error);
      })
  );
}

octenerVenta(token: string , idVenta:number , idSucursal:number): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.get<any>(environment.URL + `venta/devolucion/${idVenta}/${idSucursal}` , headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}

devolucion(token: string , idVenta:number , idSucursal:number): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.put<any>(environment.URL + `venta/devolucion/${idVenta}/${idSucursal}` , {} ,headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
}

guardarGasto(gasto: any, token: string): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.post<any>(environment.URL + "egreso", gasto, headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
  }

  corte(corte: any, token: string): Observable<any> {
    var headers = {
        headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
    };
    return this.http.post<any>(environment.URL + "corte", corte, headers).pipe(
        catchError((err) => {
            return throwError(err.error);
        })
    );
  }


}
