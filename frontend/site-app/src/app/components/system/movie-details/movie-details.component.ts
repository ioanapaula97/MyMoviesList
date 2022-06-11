import { Component, OnInit } from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {Utils} from "../../../utils/Utils";

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.less']
})
export class MovieDetailsComponent implements OnInit {

  filmSelectat: any;
  filmStatusEnum: any[] = [
    {view: '', value: null},
    {view: 'COMPLETED', value: 'COMPLETED'},
    {view: 'PLAN TO WATCH', value: 'PLAN_TO_WATCH'},
    {view: 'WATCHING', value: 'WATCHING'}
  ];
  optiuniNote: number[] = [1,2,3,4,5,6,7,8,9,10];

  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];
  filmUtilizator: any;

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
    console.log("GET FILMELE USERULUI CURENT");
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [] ;
      this.coduriFilmeFavorite = this.getCoduriFilmeFavorite(this.listaFilmeUtilizator);
      this.filmUtilizator = this.listaFilmeUtilizator.filter(f=> f.codWikiData === this.filmSelectat.codWikiData)[0] || {};
      console.log("filmUtilizator", this.filmUtilizator);
    });
  }

  getCoduriFilmeFavorite(listaFilmeUtilizator: any[]): string[]{
    let coduriFavorite: string[] = [];

    if(listaFilmeUtilizator && listaFilmeUtilizator.length > 0){
      coduriFavorite = listaFilmeUtilizator.filter(f=> f.esteFavorit === true).map(f=> f.codWikiData);
    }

    return coduriFavorite;
  }

  schimbaFavorite(film:any){
    if(this.filmulEsteFavorit(film)){
      this.filmService.eliminaFilmDeLaFavorite(this.userService.getIdUtilizatorCurent(), film.codWikiData)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    } else {
      this.filmService.adaugaFilmLaFavorite(this.userService.getIdUtilizatorCurent(), film.codWikiData)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    }

  }

  onStatusChange($event:any){
    console.log("$event", $event);
    if(this.filmSelectat.statusFilm !== $event.value){
      this.filmService.schimbaStatusFilm(this.userService.getIdUtilizatorCurent(), this.filmSelectat.codWikiData, $event.value)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    }

  }

  onNotaChange($event:any){
    console.log("$event", $event);
    if(this.filmSelectat.notaFilm !== $event.value){
      this.filmService.acordaNotaFilm(this.userService.getIdUtilizatorCurent(), this.filmSelectat.codWikiData, $event.value)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    }

  }

}
