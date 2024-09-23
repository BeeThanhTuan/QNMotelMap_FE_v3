import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/client/home/content', pathMatch: 'full' },
  { path: 'landlord', loadChildren: () => import('./modules/landlord-module/landlord-module.module').then(m => m.LandlordModuleModule) },
  { path: 'admin', loadChildren: () => import('./modules/admin-module/admin-module.module').then(m => m.AdminModuleModule) },
  { path: 'client', loadChildren: () => import('./modules/client-module/client-module.module').then(m => m.ClientModuleModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
