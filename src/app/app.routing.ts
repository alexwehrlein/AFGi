import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { HomeComponent } from "./cajero/home/home.component";
import { TraspasoComponent } from "./cajero/traspaso/traspaso.component";
import { ClientesCajerosComponent } from "./cajero/clientes-cajeros/clientes-cajeros.component";
import { VentasComponent } from "./cajero/ventas/ventas.component";
import { VerClientesCajerosComponent } from "./cajero/ver-clientes-cajeros/ver-clientes-cajeros.component";

const routes: Routes = [
    { path: "login", component: LoginComponent },
    { path: "cajero/home", component: HomeComponent },
    { path: "cajero/traspaso", component: TraspasoComponent },
    { path: "cajero/clientes", component: ClientesCajerosComponent },
    { path: "cajero/registro-cliente", component: VerClientesCajerosComponent },
    { path: "cajero/registro-cliente/:clienteId", component: VerClientesCajerosComponent },
    { path: "cajero/ventas", component: VentasComponent },
    { path: "cajero/", component: HomeComponent },
    {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
    },
    {
        path: "",
        component: AdminLayoutComponent,
        children: [
            {
                path: "",
                loadChildren: "./layouts/admin-layout/admin-layout.module#AdminLayoutModule",
            },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes, {
            useHash: true,
        }),
    ],
    exports: [],
})
export class AppRoutingModule {}
