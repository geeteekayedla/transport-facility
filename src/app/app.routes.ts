import { Routes } from '@angular/router';
import { HomeComponent } from './features/transport/home/home.component';
import { BrowseRidesComponent } from './features/transport/browse-rides/browse-rides.component';
import { AddRideComponent } from './features/transport/add-ride/add-ride.component';
import { RideDetailsComponent } from './features/transport/ride-details/ride-details.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'browse', component: BrowseRidesComponent },
  { path: 'add', component: AddRideComponent },
  { path: 'details', component: RideDetailsComponent },
  { path: '**', redirectTo: '' }
];
