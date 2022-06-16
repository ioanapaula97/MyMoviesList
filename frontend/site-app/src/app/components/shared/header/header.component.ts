import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {GoogleOauthService} from "../../../service/google-oauth.service";
import {GoogleUser} from "../../../model/GoogleUser";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  currentUser: GoogleUser | undefined;

  constructor(private googleOAuthService: GoogleOauthService,
              private changeDetectorRef: ChangeDetectorRef,
              public router: Router,
              private ngZone: NgZone) {}

  ngOnInit(): void {
    this.googleOAuthService.currentUserSubject.subscribe((user) =>{
      this.currentUser = user;
      console.log('HEADER currentUser=',this.currentUser);
      this.changeDetectorRef.detectChanges();
    });

  }

  goToLoginPage(){
    this.ngZone.run(() => this.router.navigateByUrl("/login"));
  }

  signOut(){
    this.googleOAuthService.logOut();
  }

  changeAccount(){

  }

}
