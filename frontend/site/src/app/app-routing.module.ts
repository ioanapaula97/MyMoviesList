import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/pages/home/home.component";
import {NotFoundComponent} from "./components/pages/not-found/not-found.component";
import {VideoDetailsComponent} from "./components/system/video-details/video-details.component";
import {VideoFiltersComponent} from "./components/system/video-filters/video-filters.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'detalii-film/:id', component: VideoDetailsComponent },
  { path: 'search', component: VideoFiltersComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
]; // sets up routes constant where you define your routes

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
