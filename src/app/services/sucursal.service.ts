import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class SucursalService {
    constructor(private http: HttpClient) {}

    pendientes(token: string, id: number) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .get<any>(environment.URL + "producto/porBodega/pendientes/" + id, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    solicitudHechas(token: string, id: number) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .get<any>(environment.URL + "producto/porSucursal/solicitud/hechas/" + id, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    solicitudStatus(token: string, id: number) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .get<any>(environment.URL + "producto/porSucursal/estatus/" + id, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    peticionesMedicamento(token: string, id: number) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .get<any>(environment.URL + "producto/porSucursal/pendientes/" + id, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    actualizarInventario(data: any, token: string) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .post<any>(environment.URL + "producto/porBodega/sucursal", data, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    validarExistencia(data: any, token: string) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };

        return this.http
            .post<any>(environment.URL + "producto/porSucursal/exitenciaValid", data, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    solicitud(data: any, token: string) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .post<any>(environment.URL + "producto/porSucursal/solicitud", data, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    actualizarInventarioPeticionMedicamento(data: any, token: string) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .post<any>(environment.URL + "producto/porSucursal/sucursal", data, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    validarCodigo(data: any, token: string) {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .post<any>(environment.URL + "producto/porSucursal/codigoValid", data, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }
}
