import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientModuleRoutingModule } from './client-module-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IndexComponent } from './components/index/index.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent
  ],
  imports: [
    CommonModule,
    ClientModuleRoutingModule
  ]
})
export class ClientModuleModule { }
