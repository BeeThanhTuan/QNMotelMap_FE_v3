import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientModuleRoutingModule } from './client-module-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IndexComponent } from './components/index/index.component';
import { ClickOutsideSuggestWardCommuneDirective } from './directives/click-outside-ward-commune-suggest.directive';
import { ClickOutsideDesiredPriceDirective } from './directives/click-outside-desired-price.directive';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { MoneyPipe } from './pipes/money.pipe';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    IndexComponent,
    ClickOutsideSuggestWardCommuneDirective,
    ClickOutsideDesiredPriceDirective,
    MoneyPipe,
    
  ],
  imports: [
    CommonModule,
    ClientModuleRoutingModule,
    NgxSliderModule
  ]
})
export class ClientModuleModule { }
