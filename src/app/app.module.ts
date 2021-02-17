import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";

import { AppComponent } from "./app.component";

import { NgxSpinnerModule } from "ngx-spinner";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ListarEmpleadosComponent } from "./listar-empleados/listar-empleados.component";
import { RegistroProveedorComponent } from "./proveedor/registro-proveedor/registro-proveedor.component";
import { VerProveedorComponent } from "./proveedor/ver-proveedor/ver-proveedor.component";
import { VerClientesComponent } from "./Clientes/ver-clientes/ver-clientes.component";
import { RegistroClientesComponent } from "./Clientes/registro-clientes/registro-clientes.component";
import { ProductosComponent } from "./productos/productos.component";

import { AgmCoreModule } from "@agm/core";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { DialogProductosComponent } from "./productos/dialog-productos/dialog-productos.component";
import { DialogProductosUpdateComponent } from "./productos/dialog-productos-update/dialog-productos-update.component";
import { DialogProductosTrasferenciaComponent } from "./productos/dialog-productos-trasferencia/dialog-productos-trasferencia.component";
import { HomeComponent } from "./cajero/home/home.component";
import { NavbarCajeroComponent } from "./cajero/navbar-cajero/navbar-cajero.component";
import { ModelPendientesComponent } from "./cajero/model-pendientes/model-pendientes.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TraspasoComponent } from "./cajero/traspaso/traspaso.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatRippleModule } from "@angular/material/core";
import { ModelTraspasoComponent } from "./cajero/model-traspaso/model-traspaso.component";
import { MatSelectModule } from "@angular/material/select";
import { ModelPasswordComponent } from "./cajero/model-password/model-password.component";
import { ClientesCajerosComponent } from "./cajero/clientes-cajeros/clientes-cajeros.component";
import { VerClientesCajerosComponent } from "./cajero/ver-clientes-cajeros/ver-clientes-cajeros.component";
import { SpinnerComponent } from './spinner/spinner.component';
import { ModalInfoComponent } from './cajero/modal-info/modal-info.component';
import { ModalPrecioProductoComponent } from './productos/modal-precio-producto/modal-precio-producto.component';
import { VentasComponent } from './cajero/ventas/ventas.component';
import { ModalDescuentosComponent } from './cajero/modal-descuentos/modal-descuentos.component';
import { ModelInfoProductoComponent } from './cajero/model-info-producto/model-info-producto.component';
import { ModelConsultorioComponent } from './cajero/model-consultorio/model-consultorio.component';
import { ModalDevolucionesComponent } from './cajero/modal-devoluciones/modal-devoluciones.component';
import { ModalVentaComponent } from './cajero/modal-venta/modal-venta.component';
import { ModalGastoComponent } from './cajero/modal-gasto/modal-gasto.component';
import { ModelCorteComponent } from './cajero/model-corte/model-corte.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatButtonModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        NgxSpinnerModule,
        MatAutocompleteModule,
        AgmCoreModule.forRoot({
            apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
        }),
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        HomeComponent,
        NavbarCajeroComponent,
        ModelPendientesComponent,
        TraspasoComponent,
        ModelTraspasoComponent,
        ModelPasswordComponent,
        ModalDescuentosComponent,
        ClientesCajerosComponent,
        VerClientesComponent,
        RegistroClientesComponent,
        VerClientesCajerosComponent,
        SpinnerComponent,
        ModalInfoComponent,
        VentasComponent,
        ModelInfoProductoComponent,
        ModelConsultorioComponent,
        ModalDevolucionesComponent,
        ModalVentaComponent,
        ModalGastoComponent,
        ModelCorteComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],
    entryComponents: [ModelPendientesComponent, ModelTraspasoComponent,ModalInfoComponent,ModalDescuentosComponent,ModelConsultorioComponent,ModalDevolucionesComponent,ModalVentaComponent,ModalGastoComponent,ModelCorteComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
