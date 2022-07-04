import {Component, OnInit} from '@angular/core';
import {GoogleOauthService} from "./service/google-oauth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'MyMoviesList';

  ngOnInit() {
    console.log("AppComponent ngOnInit");
    setTimeout(() =>{
      this.googleOAuthService.loadGoogleOauthAPI();
    }, 100);
  }

  constructor(private googleOAuthService: GoogleOauthService) {
    console.log("AppComponent constructor");
  }
}
