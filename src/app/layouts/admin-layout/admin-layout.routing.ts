import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { ListarEmpleadosComponent } from '../../listar-empleados/listar-empleados.component';
import { RegistroProveedorComponent } from '../../proveedor/registro-proveedor/registro-proveedor.component';
import { VerProveedorComponent } from '../../proveedor/ver-proveedor/ver-proveedor.component';
import { RegistroClientesComponent } from '../../Clientes/registro-clientes/registro-clientes.component' 
import { VerClientesComponent } from '../../Clientes/ver-clientes/ver-clientes.component' 
import { ProductosComponent } from '../../productos/productos.component' 

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'user-profile/:empleadoId',   component: UserProfileComponent },
    { path: 'user-list',   component: ListarEmpleadosComponent },
    { path: 'proveedor-list',   component: VerProveedorComponent },
    { path: 'proveedor',   component: RegistroProveedorComponent },
    { path: 'proveedor/:proveedorId',   component: RegistroProveedorComponent },
    { path: 'clientes-list',   component: VerClientesComponent },
    { path: 'cliente',   component: RegistroClientesComponent },
    { path: 'cliente/:clienteId',   component: RegistroClientesComponent },
    { path: 'productos',   component: ProductosComponent },
];
