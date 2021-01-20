import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { Cliente } from "../models/cliente";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class ClientesService {
    clientes: Cliente = new Cliente();

    constructor(private http: HttpClient) {}

    registarCliente(cliente: Cliente, token: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.post<Cliente>(environment.URL + "cliente", cliente, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    octenerTodosLosClientes(token: string): Observable<Cliente[]> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Cliente[]>(environment.URL + "cliente", headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    octenerCliente(id: number, token: string): Observable<Cliente> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Cliente>(environment.URL + "cliente/" + id, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    editarCliente(cliente: Cliente, id: number, token: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.put<Cliente>(environment.URL + "cliente/" + id, cliente, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    editarDescuentos(cliente: Cliente, token: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .put<Cliente>(environment.URL + "cliente/descuentos", cliente, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    eliminarCliente(id: number, token: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.delete<Cliente>(environment.URL + "cliente/" + id, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }
}
