import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientModuleRoutingModule } from './client-module-routing.module';
import { HomeComponent } from './components/home/home.component';
import { ClickOutsideSuggestAddressDirective } from './directives/click-outside-address-suggest.directive';
import { ClickOutsideDesiredPriceDirective } from './directives/click-outside-desired-price.directive';
import { ClickOutsideOtherChooseFieldsDirective } from './directives/click-outside-other-choose-fields.directive';
import { MoneyPipe } from './pipes/money.pipe';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ContentMainComponent } from './components/content-main/content-main.component';
import { ClickPrevRecommendMotelDirective } from './directives/click-prev-recommend-motel.directive';
import { ClickNextRecommendMotelDirective } from './directives/click-next-recommend-motel.directive';
import { SearchComponent } from './components/search/search.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DetailMotelComponent } from './components/details-motel/detail-motel/detail-motel.component';
import { OverallComponent } from './components/details-motel/overall/overall.component';
import { RoomTypesComponent } from './components/details-motel/room-types/room-types.component';
import { ViewOnMapComponent } from './components/view-on-map/view-on-map.component';
import { ViewMotelOnMapComponent } from './components/view-motel-on-map/view-motel-on-map.component';
import { ClickOutsidePopupMotelOnMapDirective } from './directives/click-outside-popup-motel-on-map.directive';
import { PhonePipe } from './pipes/phone.pipe';
import { ShareModuleModule } from '../share-module/share-module.module';
//ant design
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzMessageModule } from 'ng-zorro-antd/message';
//loading
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LineBreakPipe } from './pipes/line-break.pipe';
import { FavoriteMotelsComponent } from './components/favorite-motels/favorite-motels.component';

//
@NgModule({
  declarations: [
    HomeComponent,
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
    ViewOnMapComponent,
    ViewMotelOnMapComponent,
    PhonePipe,
    RoomTypesComponent,
    LineBreakPipe,
    FavoriteMotelsComponent,
    
  ],
  imports: [
    CommonModule,
    ClientModuleRoutingModule,
    NgxSliderModule,
    FormsModule,
    ShareModuleModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    NzInputModule,
    NzSwitchModule,
    NzCheckboxModule,
    NzSliderModule,
    NzRateModule,
    NzDrawerModule,
    NzDropDownModule,
    NzRadioModule,
    NzToolTipModule,
    NzMessageModule,
    NgxSpinnerModule,
    NgxSkeletonLoaderModule
  ]
})
export class ClientModuleModule { }
