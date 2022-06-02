import { Component, OnInit } from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  listaFilmeWikiData: any[];

  constructor(private filmService: FilmService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.filmService.getFilmeDupaTopScor().subscribe((resp) => {
      this.listaFilmeWikiData = resp ? resp : [] ;
    });


  }

}
