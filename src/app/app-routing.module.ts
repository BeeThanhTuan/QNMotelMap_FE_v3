import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { checkRoleAdminGuard } from './guards/checkRoleAdmin.guard';
import { checkRoleLandlordGuard } from './guards/checkRoleLandlord.guard';
const routes: Routes = [
  { path: '', redirectTo: '/client/home/content', pathMatch: 'full' },
  { path: '', loadChildren: () => import('./modules/share-module/share-module.module').then(m => m.ShareModuleModule) },
  { path: 'landlord', loadChildren: () => import('./modules/landlord-module/landlord-module.module').then(m => m.LandlordModuleModule), canActivate:[checkRoleLandlordGuard] },
  { path: 'admin', loadChildren: () => import('./modules/admin-module/admin-module.module').then(m => m.AdminModuleModule), canActivate: [checkRoleAdminGuard] },
  { path: 'client', loadChildren: () => import('./modules/client-module/client-module.module').then(m => m.ClientModuleModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
