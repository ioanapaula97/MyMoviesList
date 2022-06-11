import { Component, OnInit } from '@angular/core';
import {SocialAuthService} from "angularx-social-login";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  menuList= [];

  constructor(private router: Router,
              public socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      console.log("!!!!!socialAuthService");
      console.log("!!!!!HeaderComponent ngOnInit(), user=", user);
          if (!user) {
            this.router.navigate(['login']);
          }

    });
  }

  logout(): void {
    // this.socialAuthService.signOut().then(() => this.router.navigate(['login']));
  }
}
