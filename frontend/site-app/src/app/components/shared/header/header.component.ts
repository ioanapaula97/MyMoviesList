import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {GoogleOauthService} from "../../../service/google-oauth.service";
import {GoogleUser} from "../../../model/GoogleUser";
import {Router} from "@angular/router";
import {Utils} from "../../../utils/Utils";
import {UserService} from "../../../service/user.service";

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
              private ngZone: NgZone,
              private userService: UserService,) {}

  ngOnInit(): void {
    this.googleOAuthService.currentUserSubject.subscribe((user) =>{
      this.currentUser = user;
      console.log('HEADER currentUser=',this.currentUser);
      if(this.currentUser) Utils.setEmailUserCurentInLocalStorage(this.currentUser.email);
      this.changeDetectorRef.detectChanges();

      this.salveazaUserDacaNuExista();
    });

  }

  salveazaUserDacaNuExista(){
    if(this.currentUser){
      this.userService.getUserDupaAdresaEmailSauSalveazaNouUser(this.currentUser.email).subscribe((res) =>{
        console.log("HEADER - getUserDupaAdresaEmailSauSalveazaNouUser");
        console.log("HEADER - USER DIN BAZA DE DATE= ", res);
        if(res){
          Utils.setIdUserCurentInLocalStorage('' + res.id);
        }
      });
    }

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
