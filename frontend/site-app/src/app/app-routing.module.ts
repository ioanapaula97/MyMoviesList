import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/pages/home/home.component";
import {NotFoundComponent} from "./components/pages/not-found/not-found.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {MovieFiltersComponent} from "./components/system/movie-filters/movie-filters.component";
import {MovieDetailsComponent} from "./components/pages/movie-details/movie-details.component";
import {LoginComponent} from "./components/pages/login/login.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'movie-details/:codWikiData', component: MovieDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'search', component: MovieFiltersComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
]; // sets up routes constant where you define your routes

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
