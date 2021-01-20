import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Usuario } from "../models/usuarios";
import { Sucursal } from "../models/sucursal";
import { Turno } from "../models/turno";
import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class UsuarioService {
    usuario: Usuario = new Usuario();
    sucursal: Sucursal = new Sucursal();
    turno: Turno = new Turno();

    constructor(private http: HttpClient) {}

    octenerSucursales(token: string): Observable<Sucursal[]> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Sucursal[]>(environment.URL + "sucursal", headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    octenerTurnos(token: string): Observable<Turno[]> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Turno[]>(environment.URL + "turno", headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    guardarUsuario(usuario: Usuario, token: string): Observable<Usuario> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.post<Usuario>(environment.URL + "usuario", usuario, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    editarUsuario(usuario: Usuario, id: string, token: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.put<Usuario>(environment.URL + "usuario/" + id, usuario, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    octenerUsuario(idUsuario: number, token: string): Observable<Usuario> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.get<Usuario>(environment.URL + "usuario/" + idUsuario, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    octenerUsuarioSucursal(idSucursal: number, token: string): Observable<Usuario> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .get<Usuario>(environment.URL + "usuario/sucursal/" + idSucursal, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }

    eliminarUsuario(idUsuario: number, token: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http.delete<Usuario>(environment.URL + "usuario/" + idUsuario, headers).pipe(
            catchError((err) => {
                return throwError(err.error);
            })
        );
    }

    obtenerDatos(token: string, username: string): Observable<any> {
        var headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${token}`),
        };
        return this.http
            .get<any>(environment.URL + "usuario/obtenerDatos/" + username, headers)
            .pipe(
                catchError((err) => {
                    return throwError(err.error);
                })
            );
    }
}
