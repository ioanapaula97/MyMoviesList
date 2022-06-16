import {AfterViewInit, Component, ElementRef, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";
import {GoogleOauthService} from "../../../service/google-oauth.service";
import {GoogleUser} from "../../../model/GoogleUser";

// declare var google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit , AfterViewInit {



  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private googleOAuthService: GoogleOauthService) { }

  ngOnInit(): void {
    this.googleOAuthService.renderLoginButton();
  }

  ngAfterViewInit(): void {

  }

  onLogout(){
    // console.log("logout!!!!");
    // var auth2 = gapi.auth2.getAuthInstance();
    // auth2.signOut().then(function () {
    //   console.log('User signed out.');
    // });
  }

  onSignIn(googleUser:any) {
    console.log('onSignIn googleUser', googleUser);
    // // Useful data for your client-side scripts:
    // var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    // console.log('Full Name: ' + profile.getName());
    // console.log('Given Name: ' + profile.getGivenName());
    // console.log('Family Name: ' + profile.getFamilyName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail());
    //
    // // The ID token you need to pass to your backend:
    // var id_token = googleUser.getAuthResponse().id_token;
    // console.log("ID Token: " + id_token);
  }

  isSignedIn(){
    console.log("this.googleOAuthService.isSignedIn()= ", this.googleOAuthService.isSignedIn());
  }

}

