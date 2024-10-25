import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordModuleRoutingModule } from './landlord-module-routing.module';
import { ManageComponent } from './components/manage/manage.component';
import { ShareModuleModule } from '../share-module/share-module.module';

@NgModule({
  declarations: [
    ManageComponent
  ],
  imports: [
    CommonModule,
    LandlordModuleRoutingModule,
    ShareModuleModule
  ]
})
export class LandlordModuleModule { }
