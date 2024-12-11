import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './components/manage/manage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MotelsComponent } from './components/motels/motels.component';
import { UsersComponent } from './components/users/users.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage', pathMatch: 'full' },
  {
    path: 'manage',
    component: ManageComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent},
      { path: 'motels', component: MotelsComponent},
      { path: 'rooms', component: RoomTypesComponent},
      { path: 'users', component: UsersComponent},

    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminModuleRoutingModule { }
