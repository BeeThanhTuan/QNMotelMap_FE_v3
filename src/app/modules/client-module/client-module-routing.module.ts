import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContentMainComponent } from './components/content-main/content-main.component';
import { DetailMotelComponent } from './components/details-motel/detail-motel/detail-motel.component';
import { OverallComponent } from './components/details-motel/overall/overall.component';
import { RoomsComponent } from './components/details-motel/rooms/rooms.component';
import { SearchComponent } from './components/search/search.component';
import { RatingComponent } from './components/details-motel/rating/rating.component';
import { RoomDetailComponent } from './components/details-motel/room-detail/room-detail.component';
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
          { path: 'rooms', component: RoomsComponent},
          { path: 'rating', component: RatingComponent },
          { path: 'rooms', component: RoomsComponent},
          { path: 'room/:id', component: RoomDetailComponent},
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
