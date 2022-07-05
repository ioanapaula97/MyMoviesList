import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../environments/environment";
import {GoogleUser} from "../model/GoogleUser";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";
import {Utils} from "../utils/Utils";

declare var gapi: any;
@Injectable({providedIn: 'root'})
export class GoogleOauthService {
  private currentUser: GoogleUser | undefined = undefined;
  public currentUserSubject: BehaviorSubject<GoogleUser | undefined> = new BehaviorSubject(this.currentUser);
  private googleAuth: any;

  constructor(private router: Router, private ngZone: NgZone) {}

  loadGoogleOauthAPI() {
    gapi.load('auth2', () => {
      gapi.auth2.init({client_id: environment.googleOAuthClientID, plugin_name: "MyMoviesList-app"}).then(
        (onInit: any) => {this.googleAuth = gapi.auth2.getAuthInstance();
                          this.updateCurrentUser(); this.listenForUserSignedInStateChanges();
        }, (onError: any) => {console.log('***** gapi.auth2.init error=', onError);});});}

  listenForUserSignedInStateChanges(){
    this.googleAuth.isSignedIn.listen((isSignedIn:boolean) => {
      console.log("!!!SIGNED IN STATE CHANGED");
      if(isSignedIn) { this.updateCurrentUser(); }
      if((this.currentUser !== undefined) && (this.router.url === '/login')) {
        this.ngZone.run(() => this.router.navigateByUrl("/"));}});}

  updateCurrentUser(){
    let basicProfile = this.googleAuth.currentUser.get().getBasicProfile();
    if(basicProfile) {this.currentUser = new GoogleUser(basicProfile.getGivenName(), basicProfile.getFamilyName(),
      basicProfile.getEmail(), basicProfile.getImageUrl());} else{ this.currentUser = undefined;}
    this.currentUserSubject.next(this.currentUser);}

  renderLoginButton() {gapi.signin2.render(document.getElementById("googleLoginButton"), {longtitle: true});}
  isSignedIn() {return this.googleAuth.isSignedIn.get();}

  logOut() {
    this.googleAuth.signOut().then( () => {
      Utils.setEmailUserCurentInLocalStorage('none');
      Utils.setIdUserCurentInLocalStorage('0');
      this.currentUser = undefined; this.currentUserSubject.next(undefined);
      this.ngZone.run(() => this.router.navigateByUrl("/login"));});}
}
