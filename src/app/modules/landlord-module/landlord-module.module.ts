import { NgModule, NgZone } from '@angular/core';
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
import { NgxSpinnerModule } from "ngx-spinner";
import { PhonePipe } from './pipes/phone.pipe';
import { MotelsComponent } from './components/motels/motels.component';
import { MoneyPipe } from './pipes/money.pipe';
import { PopupUpdateMotelComponent } from './components/popup-update-motel/popup-update-motel.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { MotelDetailComponent } from './components/motel-detail/motel-detail.component';
import { PopupAddRoomTypeComponent } from './components/popup-add-room-type/popup-add-room-type.component';
import { PopupUpdateRoomTypeComponent } from './components/popup-update-room-type/popup-update-room-type.component';

@NgModule({
  declarations: [
    ManageComponent,
    PopupAddMotelComponent,
    PhonePipe,
    MotelsComponent,
    MoneyPipe,
    PopupUpdateMotelComponent,
    RoomTypesComponent,
    MotelDetailComponent,
    PopupAddRoomTypeComponent,
    PopupUpdateRoomTypeComponent,
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
    NgxSpinnerModule
  ]
})
export class LandlordModuleModule { }
