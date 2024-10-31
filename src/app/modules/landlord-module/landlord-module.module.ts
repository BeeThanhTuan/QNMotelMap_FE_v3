import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandlordModuleRoutingModule } from './landlord-module-routing.module';
import { ManageComponent } from './components/manage/manage.component';
import { ShareModuleModule } from '../share-module/share-module.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { PopupAddMotelComponent } from './components/popup-add-motel/popup-add-motel.component';
@NgModule({
  declarations: [
    ManageComponent,
    PopupAddMotelComponent,
  ],
  imports: [
    CommonModule,
    LandlordModuleRoutingModule,
    ShareModuleModule,
    NzToolTipModule,
    NzUploadModule
  ]
})
export class LandlordModuleModule { }
