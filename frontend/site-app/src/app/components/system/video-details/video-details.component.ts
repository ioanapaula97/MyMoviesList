import { Component, OnInit } from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {Utils} from "../../../utils/Utils";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-video-details',
  templateUrl: './video-details.component.html',
  styleUrls: ['./video-details.component.less']
})
export class VideoDetailsComponent implements OnInit {

  filmSelectat: any;
  filmStatusEnum: any[] = [
    {view: 'COMPLETED', value: 'COMPLETED'},
    {view: 'PLAN TO WATCH', value: 'PLAN_TO_WATCH'},
    {view: 'WATCHING', value: 'WATCHING'}
  ];

  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];

  constructor(private filmService: FilmService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.getFilmeleUtilizatoruluiCurent();
    let filmStr: string = localStorage.getItem('filmSelectat') || '';
    this.filmSelectat = JSON.parse(filmStr) as Object;

    console.log('film selectat', this.filmSelectat);
  }

  getTooltip(film: any): string {
    return Utils.getTooltipButonFavorite(film, this.coduriFilmeFavorite);
  }

  filmulEsteFavorit(film: any){
    return Utils.filmulEsteFavorit(film.codWikiData, this.coduriFilmeFavorite);
  }

  getFilmeleUtilizatoruluiCurent(){
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [] ;
      this.coduriFilmeFavorite = this.getCoduriFilmeFavorite(this.listaFilmeUtilizator);
    });
  }

  getCoduriFilmeFavorite(listaFilmeUtilizator: any[]): string[]{
    let coduriFavorite: string[] = [];

    if(listaFilmeUtilizator && listaFilmeUtilizator.length > 0){
      coduriFavorite = listaFilmeUtilizator.filter(f=> f.esteFavorit === true).map(f=> f.codWikiData);
    }

    return coduriFavorite;
  }


}
