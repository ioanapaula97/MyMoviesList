import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { GlobalSearchbarComponent } from './components/system/global-searchbar/global-searchbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {HttpClientModule} from "@angular/common/http";
import { MovieListComponent } from './components/system/movie-list/movie-list.component';
import { MovieFiltersComponent } from './components/system/movie-filters/movie-filters.component';
import { FavoriteButtonComponent } from './components/system/favorite-button/favorite-button.component';
import { SearchComponent } from './components/pages/search/search.component';
import { UserProfileComponent } from './components/pages/user-profile/user-profile.component';
import {MovieDetailsComponent} from "./components/pages/movie-details/movie-details.component";
import {LoginComponent} from "./components/pages/login/login.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    LoginComponent,
    GlobalSearchbarComponent,
    MovieListComponent,
    MovieDetailsComponent,
    MovieFiltersComponent,
    FavoriteButtonComponent,
    SearchComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSliderModule,
    MatCardModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
