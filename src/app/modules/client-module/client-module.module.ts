import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientModuleRoutingModule } from './client-module-routing.module';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ClickOutsideSuggestAddressDirective } from './directives/click-outside-address-suggest.directive';
import { ClickOutsideDesiredPriceDirective } from './directives/click-outside-desired-price.directive';
import { ClickOutsideOtherChooseFieldsDirective } from './directives/click-outside-other-choose-fields.directive';
import { MoneyPipe } from './pipes/money.pipe';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
// Import MatSlideToggleModule
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentMainComponent } from './components/content-main/content-main.component';
import { ClickPrevRecommendMotelDirective } from './directives/click-prev-recommend-motel.directive';
import { ClickNextRecommendMotelDirective } from './directives/click-next-recommend-motel.directive';
import { SearchComponent } from './components/search/search.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DetailMotelComponent } from './components/details-motel/detail-motel/detail-motel.component';
import { OverallComponent } from './components/details-motel/overall/overall.component';
import { RoomsComponent } from './components/details-motel/rooms/rooms.component';
import { RoomDetailComponent } from './components/details-motel/room-detail/room-detail.component';
import { ViewOnMapComponent } from './components/view-on-map/view-on-map.component';
import { ViewMotelOnMapComponent } from './components/view-motel-on-map/view-motel-on-map.component';
import { ClickOutsidePopupMotelOnMapDirective } from './directives/click-outside-popup-motel-on-map.directive';
import { PhonePipe } from './pipes/phone.pipe';
import { RatingsComponent } from './components/details-motel/ratings/ratings.component';
//ant design
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzRateModule } from 'ng-zorro-antd/rate';
//loading
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ClickOutsideSuggestAddressDirective,
    ClickOutsideDesiredPriceDirective,
    ClickOutsideOtherChooseFieldsDirective,
    MoneyPipe,
    ContentMainComponent,
    ClickPrevRecommendMotelDirective,
    ClickNextRecommendMotelDirective,
    ClickOutsidePopupMotelOnMapDirective,
    SearchComponent,
    DetailMotelComponent,
    OverallComponent,
    RoomDetailComponent,
    ViewOnMapComponent,
    ViewMotelOnMapComponent,
    PhonePipe,
    RatingsComponent,
    RoomsComponent
    
  ],
  imports: [
    CommonModule,
    ClientModuleRoutingModule,
    NgxSliderModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NzInputModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzSliderModule,
    NzRateModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule
  ]
})
export class ClientModuleModule { }
