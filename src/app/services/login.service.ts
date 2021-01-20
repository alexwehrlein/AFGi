import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , throwError  } from 'rxjs';
import { environment } from '../../environments/environment';
import { Login } from '../models/login'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  user: Login = new Login();  

  constructor(private http: HttpClient) { }

  login(user: Login): Observable<any>{
    return this.http.post<Login>(environment.URL+'login' , user).pipe(
      catchError((err) => {
        return throwError(err.error);
      })
    )
  }

}
