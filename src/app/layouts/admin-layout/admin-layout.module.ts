import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminLayoutRoutes } from "./admin-layout.routing";
import { DashboardComponent } from "../../dashboard/dashboard.component";
import { UserProfileComponent } from "../../user-profile/user-profile.component";
import { ListarEmpleadosComponent } from "../../listar-empleados/listar-empleados.component";
import { RegistroProveedorComponent } from "../../proveedor/registro-proveedor/registro-proveedor.component";
import { VerProveedorComponent } from "../../proveedor/ver-proveedor/ver-proveedor.component";
import { RegistroClientesComponent } from "../../Clientes/registro-clientes/registro-clientes.component";
import { VerClientesComponent } from "../../Clientes/ver-clientes/ver-clientes.component";
import { ProductosComponent } from "../../productos/productos.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSelectModule } from "@angular/material/select";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { DialogProductosComponent } from "../../productos/dialog-productos/dialog-productos.component";
import { DialogProductosUpdateComponent } from "../../productos/dialog-productos-update/dialog-productos-update.component";
import { DialogProductosTrasferenciaComponent } from "../../productos/dialog-productos-trasferencia/dialog-productos-trasferencia.component";
import { ModalPrecioProductoComponent } from "../../productos/modal-precio-producto/modal-precio-producto.component";
import { ModelPendientesComponent } from "../../cajero/model-pendientes/model-pendientes.component";
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(AdminLayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatExpansionModule,
        MatCheckboxModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        NgxSpinnerModule,
    ],
    declarations: [
        ListarEmpleadosComponent,
        DashboardComponent,
        UserProfileComponent,
        RegistroProveedorComponent,
        VerProveedorComponent,
        //RegistroClientesComponent,
        //VerClientesComponent,
        ProductosComponent,
        DialogProductosComponent,
        DialogProductosUpdateComponent,
        DialogProductosTrasferenciaComponent,
        ModalPrecioProductoComponent
    ],
    entryComponents: [
        ModalPrecioProductoComponent,
        DialogProductosComponent,
        DialogProductosUpdateComponent,
        DialogProductosTrasferenciaComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AdminLayoutModule {}
