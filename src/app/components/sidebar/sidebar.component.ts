import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { LoginService } from 'app/services/login.service';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  token:string;
  constructor(private router:Router,private loginService: LoginService) { }

  ngOnInit() {
    this.token = localStorage.getItem("token");
    if (this.token == null) {
        this.router.navigate(["login"]);
    }
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  salir(){
    this.loginService.logout(this.token).subscribe(res => {
      localStorage.removeItem("token")
      localStorage.removeItem("rol")
      this.router.navigate(['login']);
    })
  }
}
