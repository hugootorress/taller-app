import { Routes } from '@angular/router';

import { LoginComponent } from './componentes/auth/login.component';
import { AuthGuard } from './guards/auth.guard';

import { DashboardProComponent } from './componentes/dashboard-pro/dashboard-pro.component';

import { ClientComponent } from './componentes/client/client.component';
import { ClientDetailComponent } from './componentes/client/client-detail/client-detail.component';
import { CreateClientComponent } from './componentes/client/create-client/create-client.component';
import { EditClientComponent } from './componentes/client/edit-client/edit-client.component';
import { EmailComposeComponent } from './componentes/emailcompose/emailcompose.component';

import { VehicleComponent } from './componentes/vehicle/vehicle.component';
import { VehicleDetailComponent } from './componentes/vehicle/vehicle-detail/vehicle-detail.component';
import { CreateVehicleComponent } from './componentes/vehicle/create-vehicle/create-vehicle.component';
import { EditVehicleComponent } from './componentes/vehicle/edit-vehicle/edit-vehicle.component';

import { PartComponent } from './componentes/part/part.component';
import { CreatePartComponent } from './componentes/part/create-part/create-part.component';
import { EditPartComponent } from './componentes/part/edit-part/edit-part.component';
import { PartDetailComponent } from './componentes/part/part-detail/part-detail.component';

import { RepairComponent } from './componentes/repair/repair.component';
import { CreateRepairComponent } from './componentes/repair/create-repair/create-repair.component';
import { RepairDetailComponent } from './componentes/repair/repair-detail/repair-detail.component';
import { EditRepairComponent } from './componentes/repair/edit-repair/edit-repair.component';

import { MechanicComponent } from './componentes/mechanic/mechanic.component';
import { CreateMechanicComponent } from './componentes/mechanic/create-mechanic/create-mechanic.component';
import { MechanicDetailComponent } from './componentes/mechanic/mechanic-detail/mechanic-detail.component';
import { EditMechanicComponent } from './componentes/mechanic/edit-mechanic/edit-mechanic.component';

import { AyudaComponent } from './componentes/ayuda/ayuda.component';

export const routes: Routes = [
  // Públicas
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  // Privadas
  { path: 'dashboardpro', component: DashboardProComponent, canActivate: [AuthGuard] },

  // Clientes
  { path: 'clients', component: ClientComponent, canActivate: [AuthGuard] },
  { path: 'client/:id', component: ClientDetailComponent },
  { path: 'create-client', component: CreateClientComponent },
  { path: 'edit-client/:id', component: EditClientComponent },
  { path: 'email-taller', component: EmailComposeComponent },

  //vehiculos
  { path: 'vehicles', component: VehicleComponent },
  { path: 'vehicle/:id', component: VehicleDetailComponent },
  { path: 'create-vehicle', component: CreateVehicleComponent },
  { path: 'edit-vehicle/:id', component: EditVehicleComponent },

  // Piezas
  { path: 'parts', component: PartComponent },
  { path: 'create-part', component: CreatePartComponent },
  { path: 'edit-part/:id', component: EditPartComponent },
  { path: 'part/:id', component: PartDetailComponent },

  // Reparaciones
  { path: 'repairs', component: RepairComponent },
  { path: 'repair/:id', component: RepairDetailComponent },
  { path: 'create-repair', component: CreateRepairComponent },
  { path: 'edit-repair/:id', component: EditRepairComponent },

  // Mecánicos
  { path: 'mechanics', component: MechanicComponent },
  { path: 'mechanic/:id', component: MechanicDetailComponent },
  { path: 'edit-mechanic/:id', component: EditMechanicComponent },
  { path: 'create-mechanic', component: CreateMechanicComponent },

  { path: 'ayuda', component: AyudaComponent },

];


