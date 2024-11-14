import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContentMainComponent } from './components/content-main/content-main.component';
import { DetailMotelComponent } from './components/details-motel/detail-motel/detail-motel.component';
import { OverallComponent } from './components/details-motel/overall/overall.component';
import { RoomTypesComponent } from './components/details-motel/room-types/room-types.component';
import { SearchComponent } from './components/search/search.component';
import { RoomTypeDetailComponent } from './components/details-motel/room-type-detail/room-type-detail.component';
import { ViewOnMapComponent } from './components/view-on-map/view-on-map.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: '', redirectTo: 'content', pathMatch: 'full' },
      { path: 'content', component: ContentMainComponent },
      { path: 'search', component: SearchComponent },
      { path: 'map', component: ViewOnMapComponent},
      {
        path: 'detail-motel/:id',
        component: DetailMotelComponent,
        children: [
          { path: '', redirectTo: 'overall', pathMatch: 'full' },
          { path: 'overall', component: OverallComponent },
          { path: 'roomTypes', component: RoomTypesComponent},
          { path: 'roomType/:roomTypeId', component: RoomTypeDetailComponent},
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientModuleRoutingModule {}
