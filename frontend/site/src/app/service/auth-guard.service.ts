import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
// import {SocialAuthService, SocialUser} from "angularx-social-login";
import {Observable, of} from "rxjs";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router/*,
              private socialAuthService: SocialAuthService*/) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    console.log("#####AuthGuardService");
    return  of(false);

    // return this.socialAuthService.authState.pipe(
    //   map((socialUser: SocialUser) => !!socialUser),
    //   tap((isLoggedIn: boolean) => {
    //     console.log("######AuthGuardService canActivate(), isLoggedIn=", isLoggedIn);
    //     if (!isLoggedIn) {
    //       this.router.navigate(['login']);
    //     }
    //   })
    // );

    // this.socialAuthService.authState.subscribe((user) => {
    //   console.log("AuthGuardService canActivate(), user=", user);
    //       if (!user) {
    //         this.router.navigate(['login']);
    //       }
    //   return  of(!!user);
    // });
  }
}
