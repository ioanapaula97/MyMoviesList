import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/pages/home/home.component";
import {NotFoundComponent} from "./components/pages/not-found/not-found.component";
import {LoginComponent} from "./components/system/login/login.component";
import {AuthGuardService} from "./service/auth-guard.service";
import {MovieDetailsComponent} from "./components/system/movie-details/movie-details.component";
import {MovieFiltersComponent} from "./components/system/movie-filters/movie-filters.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'detalii-film/:codWikiData', component: MovieDetailsComponent, canActivate: [AuthGuardService] },
  { path: 'search', component: MovieFiltersComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: '**', component: NotFoundComponent }
]; // sets up routes constant where you define your routes

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload', enableTracing: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
