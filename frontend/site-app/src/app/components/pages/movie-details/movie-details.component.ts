import {Component, OnInit} from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {Utils} from "../../../utils/Utils";
import {StatusFilmEnum} from "../../../model/StatusFilmEnum";
import {QueryParamsEnum} from "../../../model/QueryParamsEnum";
import {Router} from "@angular/router";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.less']
})
export class MovieDetailsComponent implements OnInit {

  filmSelectatWikiData: any;

  optiuniNote: number[] = [1, 2, 3, 4, 5];

  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];
  filmUtilizator: any;

  STATUS_ENUM = StatusFilmEnum;

  constructor(private filmService: FilmService,
              private userService: UserService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.filmSelectatWikiData = Utils.getFilmWikiDataSelectatDinLocalStorage();
    this.getFilmeleUtilizatoruluiCurent();


    console.log('film selectat wiki data=', this.filmSelectatWikiData);
  }

  getFilmeleUtilizatoruluiCurent() {
    console.log("DETAILS - GET FILMELE USERULUI CURENT");
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [];
      this.coduriFilmeFavorite = Utils.getCoduriFilmeFavorite(this.listaFilmeUtilizator);
      this.filmUtilizator = this.listaFilmeUtilizator.filter(f => f.codWikiData === this.filmSelectatWikiData.codWikiData)[0] || {};
      console.log("DETAILS - filmUtilizator", this.filmUtilizator);
    });
  }

  onNotaChange($event: any) {
    console.log("onNotaChange $event=", $event);
    this.filmService.acordaNotaFilm(this.userService.getIdUtilizatorCurent(), this.filmSelectatWikiData.codWikiData, $event.value)
      .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
  }

  cautaFilmeDupaActorulSelectat(actor:any){
    Utils.setActorSelectatInLocalStorage(actor);
    this.adaugaActorInUrlSiSchimbaRuta(actor.codWikiData);

  }

  adaugaActorInUrlSiSchimbaRuta(codActor: string){
    let urlCuFiltreActive = 'search';
    if (codActor && codActor.trim()) {
      urlCuFiltreActive += ('?' + QueryParamsEnum.ACTOR + '=' + codActor.trim());
    }
    this.router.navigateByUrl(urlCuFiltreActive);
  }

}
