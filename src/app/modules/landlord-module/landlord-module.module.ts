import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LandlordModuleRoutingModule } from './landlord-module-routing.module';
import { ManageComponent } from './components/manage/manage.component';
import { ShareModuleModule } from '../share-module/share-module.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { PopupAddMotelComponent } from './components/popup-add-motel/popup-add-motel.component';

@NgModule({
  declarations: [
    ManageComponent,
    PopupAddMotelComponent,
  ],
  imports: [
    CommonModule,
    LandlordModuleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ShareModuleModule,
    NzToolTipModule,
    NzUploadModule,
    NzDropDownModule,
    NzCheckboxModule,
  ]
})
export class LandlordModuleModule { }
