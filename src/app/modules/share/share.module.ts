import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShareRoutingModule } from './share-routing.module';
import { HeaderBarComponent } from './components/header-bar/header-bar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';


@NgModule({
  declarations: [
    HeaderBarComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    ShareRoutingModule
  ],
  exports: [HeaderBarComponent]  
})
export class ShareModule { }
