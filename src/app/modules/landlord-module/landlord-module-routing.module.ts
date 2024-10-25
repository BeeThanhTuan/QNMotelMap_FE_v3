import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './components/manage/manage.component';

const routes: Routes = [
  { path: '', redirectTo: 'manage', pathMatch: 'full' },
  {path: 'manage', component:ManageComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandlordModuleRoutingModule { }
