import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModuleRoutingModule } from './share-module-routing.module';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { LoginComponent } from './components/login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzIconModule, NZ_ICONS } from 'ng-zorro-antd/icon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { CapitalizeDirective } from './directives/capitalize.directive';
// import { EyeOutline, EyeInvisibleOutline } from '@ant-design/icons-angular/icons';

// Đăng ký các biểu tượng
// const icons: IconDefinition[] = [ EyeOutline, EyeInvisibleOutline ];

@NgModule({
  declarations: [
    HeaderBarComponent,
    LoginComponent,
    CapitalizePipe,
    CapitalizeDirective
  ],
  imports: [
    CommonModule, // Import CommonModule cho các chỉ thị cơ bản
    ShareModuleRoutingModule,
    NzInputModule, // Module cho input
    NzIconModule,  // Module cho icon
    NzTabsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    // { provide: NZ_ICONS, useValue: icons } // Đăng ký các biểu tượng
  ],
  exports: [
    HeaderBarComponent,
    LoginComponent,
  ]  
})
export class ShareModuleModule { }
