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

  onSignIn(googleUser:any) {
    console.log('onSignIn googleUser', googleUser);
  }

  isSignedIn(){
    console.log("this.googleOAuthService.isSignedIn()= ", this.googleOAuthService.isSignedIn());
  }

}

