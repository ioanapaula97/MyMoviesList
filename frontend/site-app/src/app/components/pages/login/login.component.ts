import {AfterViewInit, Component, ElementRef, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../environments/environment";

// declare var google: any;
declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit , AfterViewInit {

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private elementRed: ElementRef,
              private _ngZone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    gapi.load('auth2', function() {
      /* Ready. Make a call to gapi.auth2.init or some other API */
      gapi.auth2.init({client_id: environment.googleOAuthClientID, plugin_name: "testapp"});
      gapi.signin2.render(document.getElementById("googleLoginButton"));
    });

    // google.accounts.id.initialize({
    //   client_id: "158801350453-35bubmovs32cdmur2sm12cgt83uod3pa.apps.googleusercontent.com",
    //   callback: this.handleCredentialResponse.bind(Response)
    // });
    // google.accounts.id.renderButton(
    //   document.getElementById("googleLoginButton"),
    //   // { size: "large", type: "icon", shape: "pill" }  // customization attributes
    // { theme: "outline", size: "large", text: "Sign in with Google", locale: "en"  }  // customization attributes
    // );
    // google.accounts.id.prompt(); // also display the One Tap dialog
  }

  handleCredentialResponse(response: any) {
    //Do what you wish with the received idToken
    console.log(response.credential);
    // This next is for decoding the idToken to an object if you want to see the details.
    let base64Url = response.credential.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    let decodedResponse = JSON.parse(jsonPayload);
    console.log("decodedResponse= ", decodedResponse);
  }

  onLogout(){
    console.log("logout!!!!");
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    // google.accounts.id.disableAutoSelect();
  }

  onSignIn(googleUser:any) {
    // Useful data for your client-side scripts:
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Don't send this directly to your server!
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail());

    // The ID token you need to pass to your backend:
    var id_token = googleUser.getAuthResponse().id_token;
    console.log("ID Token: " + id_token);
  }

  isSignedIn(){
    let googleAuth = gapi.auth2.getAuthInstance();
    console.log("googleAuth= ", googleAuth);
    let googleUser = googleAuth.currentUser.get();

    console.log("googleUser= ", googleUser);
    console.log("profile= ", googleUser.getBasicProfile());
  }

}

