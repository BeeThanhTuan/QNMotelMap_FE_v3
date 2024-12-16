import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminModuleRoutingModule } from './admin-module-routing.module';
import { ManageComponent } from './components/manage/manage.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MotelsComponent } from './components/motels/motels.component';
import { UsersComponent } from './components/users/users.component';
import { RoomTypesComponent } from './components/room-types/room-types.component';
import { MoneyPipe } from './pipes/money.pipe';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NgxPaginationModule } from 'ngx-pagination';
import { PopupAddMotelComponent } from './components/popup-add-motel/popup-add-motel.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { PopupUpdateMotelComponent } from './components/popup-update-motel/popup-update-motel.component';
import { PopupAddRoomTypeComponent } from './components/popup-add-room-type/popup-add-room-type.component';
import { PopupUpdateRoomTypeComponent } from './components/popup-update-room-type/popup-update-room-type.component';
import { PopupAddUserComponent } from './components/popup-add-user/popup-add-user.component';
import { PopupUpdateUserComponent } from './components/popup-update-user/popup-update-user.component';
import { ConvenientComponent } from './components/convenient/convenient.component';
import { PopupAddConvenientComponent } from './components/popup-add-convenient/popup-add-convenient.component';
import { PopupUpdateConvenientComponent } from './components/popup-update-convenient/popup-update-convenient.component';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';
import { PhonePipe } from './pipes/phone.pipe';
import { SearchFilterPipe } from './pipes/search-filter.pipe';
@NgModule({
  declarations: [
    ManageComponent,
    DashboardComponent,
    MotelsComponent,
    UsersComponent,
    RoomTypesComponent,
    MoneyPipe,
    PopupAddMotelComponent,
    PopupUpdateMotelComponent,
    PopupAddRoomTypeComponent,
    PopupUpdateRoomTypeComponent,
    PopupAddUserComponent,
    PopupUpdateUserComponent,
    ConvenientComponent,
    PopupAddConvenientComponent,
    PopupUpdateConvenientComponent,
    UpdateProfileComponent,
    PhonePipe,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    AdminModuleRoutingModule,
    NzToolTipModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    NzCheckboxModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NzDropDownModule
  ]
})
export class AdminModuleModule { }
