import {Injectable, NgZone} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {GoogleOauthService} from "./google-oauth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private googleOAuthService: GoogleOauthService, private router: Router, private ngZone: NgZone) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) =>{setTimeout( () => {
        if(this.googleOAuthService.isSignedIn()) resolve(true);
        else { this.ngZone.run(() => this.router.navigateByUrl("/login"));
          resolve(false);}}, 1000);});
  }
}
