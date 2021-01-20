import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Observable , throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Proveedor } from '../models/proveedor'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  proveedores: Proveedor = new Proveedor();

  constructor(private http: HttpClient) { }

  registarProveedor(proveedor: Proveedor,token:string): Observable<any>{
    var headers = {
      headers: new HttpHeaders()
        .set('Authorization' , `Bearer ${token}`)
    }
    return this.http.post<Proveedor>(environment.URL+'proveedor' , proveedor,headers).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

  octenerTodosLosProveedores(token:string): Observable<Proveedor[]>{
    var headers = {
      headers: new HttpHeaders()
        .set('Authorization' , `Bearer ${token}`)
    }
    return this.http.get<Proveedor[]>(environment.URL+'proveedor',headers).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

  octenerProveedor(id:number,token:string): Observable<Proveedor>{
    var headers = {
      headers: new HttpHeaders()
        .set('Authorization' , `Bearer ${token}`)
    }
    return this.http.get<Proveedor>(environment.URL+'proveedor/'+id,headers).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

  editarProveedor( proveedor:Proveedor , id:number,token:string): Observable<any>{
    var headers = {
      headers: new HttpHeaders()
        .set('Authorization' , `Bearer ${token}`)
    }
    return this.http.put<Proveedor>(environment.URL+'proveedor/'+id , proveedor,headers).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

  eliminarProveedor(id:number,token:string): Observable<any>{
    var headers = {
      headers: new HttpHeaders()
        .set('Authorization' , `Bearer ${token}`)
    }
    return this.http.delete<Proveedor>(environment.URL+'proveedor/'+id,headers).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

}
