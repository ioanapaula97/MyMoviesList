import {Component, OnInit} from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {Utils} from "../../../utils/Utils";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.less']
})
export class MovieDetailsComponent implements OnInit {

  filmSelectatWikiData: any;
  filmStatusEnum: any[] = [
    {view: '', value: null},
    {view: 'COMPLETED', value: 'COMPLETED'},
    {view: 'PLAN TO WATCH', value: 'PLAN_TO_WATCH'},
    {view: 'WATCHING', value: 'WATCHING'}
  ];
  optiuniNote: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];
  filmUtilizator: any;

  constructor(private filmService: FilmService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.filmSelectatWikiData = Utils.getFilmWikiDataSelectatDinLocalStorage();
    this.getFilmeleUtilizatoruluiCurent();


    console.log('film selectat wiki data=', this.filmSelectatWikiData);
  }

  getFilmeleUtilizatoruluiCurent() {
    console.log("GET FILMELE USERULUI CURENT");
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [];
      this.coduriFilmeFavorite = Utils.getCoduriFilmeFavorite(this.listaFilmeUtilizator);
      this.filmUtilizator = this.listaFilmeUtilizator.filter(f => f.codWikiData === this.filmSelectatWikiData.codWikiData)[0] || {};
      console.log("filmUtilizator", this.filmUtilizator);
    });
  }

  onStatusChange($event: any) {
    console.log("$event", $event);
    if (this.filmUtilizator.statusFilm !== $event.value) {
      this.filmService.schimbaStatusFilm(this.userService.getIdUtilizatorCurent(), this.filmUtilizator.codWikiData, $event.value)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    }

  }

  onNotaChange($event: any) {
    console.log("$event", $event);
    if (this.filmUtilizator.notaFilm !== $event.value) {
      this.filmService.acordaNotaFilm(this.userService.getIdUtilizatorCurent(), this.filmUtilizator.codWikiData, $event.value)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    }

  }

}
