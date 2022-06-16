import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";
import {GoogleUser} from "../model/GoogleUser";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleOauthService {

  private currentUser: GoogleUser | undefined = undefined;
  public currentUserSubject: BehaviorSubject<GoogleUser | undefined> = new BehaviorSubject(this.currentUser);
  private googleAuth: any;

  constructor(private router: Router,
              private ngZone: NgZone) {}

  loadGoogleOauthAPI() {
    gapi.load('auth2', () => {
      gapi.auth2.init({client_id: environment.googleOAuthClientID, plugin_name: "MyMoviesList-app"}).then(
        (onInit: any) => {
          this.googleAuth = gapi.auth2.getAuthInstance();
          this.updateCurrentUser();
          this.listenForUserSignedInStateChanges();
        }, (onError: any) => {console.log('***** gapi.auth2.init error=', onError);});
    });
  }

  listenForUserSignedInStateChanges(){
    this.googleAuth.isSignedIn.listen((isSignedIn:boolean) => {
      if(isSignedIn) { this.updateCurrentUser(); }
      if((this.currentUser !== undefined) && (this.router.url === '/login')) {
        this.ngZone.run(() => this.router.navigateByUrl("/"));
      }});
  }

  updateCurrentUser(){
    let basicProfile = this.googleAuth.currentUser.get().getBasicProfile();
    if(basicProfile) {this.currentUser = new GoogleUser(basicProfile.getGivenName(), basicProfile.getFamilyName(),
      basicProfile.getEmail(), basicProfile.getImageUrl());}
    else{ this.currentUser = undefined;}
    this.currentUserSubject.next(this.currentUser);
  }

  isSignedIn() {
    //true if the user is signed in, or false if the user is signed out or the GoogleAuth object isn't initialized.
    return this.googleAuth.isSignedIn.get();
  }

  renderLoginButton() {
    gapi.signin2.render(document.getElementById("googleLoginButton"), {longtitle: true});
  }

  logOut() {
    this.googleAuth.signOut().then( () => {
      console.log('***** User signed out.');
      this.currentUser = undefined;
      this.currentUserSubject.next(undefined);
      this.ngZone.run(() => this.router.navigateByUrl("/"));
    });
  }



//   test() {
//     //Returns the GoogleAuth object. You must initialize the GoogleAuth object with gapi.auth2.init() before calling this method.
//     let googleAuth = gapi.auth2.getAuthInstance();
//     console.log("googleAuth= ", googleAuth);
//
//     //Returns whether the current user is currently signed in.
//     //true if the user is signed in, or false if the user is signed out or the GoogleAuth object isn't initialized.
//     console.log("GoogleAuth.isSignedIn.get()= ", googleAuth.isSignedIn.get());
//
//     let googleUser = googleAuth.currentUser.get();
//     console.log("googleUser= ", googleUser);
//
//     let basicProfile = googleUser.getBasicProfile();
//     console.log("profile= ", basicProfile);
//     console.log("email= ", basicProfile.getEmail());
//     /*
//     You can retrieve the properties of gapi.auth2.BasicProfile with the following methods:
// BasicProfile.getId()
// BasicProfile.getName()
// BasicProfile.getGivenName()
// BasicProfile.getFamilyName()
// BasicProfile.getImageUrl()
// BasicProfile.getEmail()
//      */
//   }

  /*
   loadGoogleOauthAPI() {
    console.log('***** loadGoogleOauthAPI');
    gapi.load('auth2', () => {
      // Ready. Make a call to gapi.auth2.init or some other API

  //render login button
  gapi.signin2.render(document.getElementById("googleLoginButton"));

  //Initializes the GoogleAuth object
  //Then, if the user has already signed in, the GoogleAuth object restores the user's sign-in state from the previous session.
  gapi.auth2.init({client_id: environment.googleOAuthClientID, plugin_name: "MyMoviesList-app"}).then(
(onInit: any) =>{
  console.log('***** gapi.auth2.init onInit', onInit);
  this.googleAuth = gapi.auth2.getAuthInstance();
  let userProfile = this.googleAuth.currentUser.get().getBasicProfile();

  this.currentUser = new GoogleUser(userProfile.getGivenName(), userProfile.getFamilyName(),
    userProfile.getEmail(), userProfile.getImageUrl());
  console.log('***** currentUser=', this.currentUser);

  this.currentUserSubject.next(this.currentUser);
},
(onError: any) =>{
  console.log('***** gapi.auth2.init onError', onError);
});

// GoogleAuth.isSignedIn.listen(listener)
// Listen for changes in the current user's sign-in state.

} );
}
  * */
}
