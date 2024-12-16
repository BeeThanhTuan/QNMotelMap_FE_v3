import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModuleRoutingModule } from './share-module-routing.module';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { LoginComponent } from './components/login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule, } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { CapitalizeDirective } from './directives/capitalize.directive';
import { PhonePipe } from './pipes/phone.pipe';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { UpdateProfileComponent } from './components/update-profile/update-profile.component';

@NgModule({
  declarations: [
    HeaderBarComponent,
    LoginComponent,
    CapitalizePipe,
    CapitalizeDirective,
    PhonePipe,
    UpdateProfileComponent,
  ],
  imports: [
    CommonModule, // Import CommonModule cho các chỉ thị cơ bản
    ShareModuleRoutingModule,
    NzInputModule, // Module cho input
    NzIconModule,  // Module cho icon
    NzTabsModule,
    NzToolTipModule,
    NzDropDownModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
  ],
  exports: [
    HeaderBarComponent,
    LoginComponent,
    UpdateProfileComponent
  ]  
})
export class ShareModuleModule { }
