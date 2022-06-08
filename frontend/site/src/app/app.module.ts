import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/pages/home/home.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { VideoListComponent } from './components/system/video-list/video-list.component';
import { VideoFiltersComponent } from './components/system/video-filters/video-filters.component';
import { VideoDetailsComponent } from './components/system/video-details/video-details.component';
import { UserProfileComponent } from './components/system/user-profile/user-profile.component';
import { UserVideosComponent } from './components/system/user-videos/user-videos.component';
import { LoginComponent } from './components/system/login/login.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    NotFoundComponent,
    VideoListComponent,
    VideoFiltersComponent,
    VideoDetailsComponent,
    UserProfileComponent,
    UserVideosComponent,
    LoginComponent,
    GlobalSearchbarComponent
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
