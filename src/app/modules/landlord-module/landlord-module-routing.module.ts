import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './components/manage/manage.component';
import { MotelsComponent } from './components/motels/motels.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { MotelDetailComponent } from './components/motel-detail/motel-detail.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage', pathMatch: 'full' },
  {path: 'manage', component:ManageComponent, children:[
    { path: '', redirectTo: 'motels', pathMatch: 'full' },
    { path: 'motels', component: MotelsComponent },
    { path: 'motel-detail/:id', component: MotelDetailComponent },
    { path: 'room-types', component: RoomTypesComponent },

  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandlordModuleRoutingModule { }
