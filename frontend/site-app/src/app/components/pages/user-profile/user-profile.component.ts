import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {GoogleUser} from "../../../model/GoogleUser";
import {GoogleOauthService} from "../../../service/google-oauth.service";
import {Router} from "@angular/router";
import {MoviesListDisplayTypeEnum} from "../../../model/MoviesListDisplayTypeEnum";
import {Utils} from "../../../utils/Utils";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {StatusFilmEnum} from "../../../model/StatusFilmEnum";
import {MovieListComponent} from "../../system/movie-list/movie-list.component";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.less']
})
export class UserProfileComponent implements OnInit {
  currentUser: GoogleUser | undefined;

  DISPLAY_TYPE = MoviesListDisplayTypeEnum;

  listaFilmeUtilizator: any[];
  listaFilmeWikiData: any[];

  listaFavoriteWikiData: any[];
  listaCompletedWikiData: any[];
  listaWatchingWikiData: any[];
  listaPlanToWatchWikiData: any[];

  @ViewChild('listaFavorite') listaFavoriteComp:MovieListComponent;
  @ViewChild('listaCompleted') listaCompletedComp:MovieListComponent;
  @ViewChild('listaWatching') listaWatchingComp:MovieListComponent;
  @ViewChild('listaPlanToWatch') listaPlanToWatchComp:MovieListComponent;

  constructor(private googleOAuthService: GoogleOauthService,
              private changeDetectorRef: ChangeDetectorRef,
              public router: Router,
              private ngZone: NgZone,
              private filmService: FilmService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.seteazaDetaliileUtilizatoruluiDinContulGoogle();
    this.getFilmeleUtilizatoruluiCurent(true, false);

  }

  seteazaDetaliileUtilizatoruluiDinContulGoogle(){
    this.googleOAuthService.currentUserSubject.subscribe((user) => {
      this.currentUser = user;
      console.log('PROFILE currentUser=', this.currentUser);
      this.changeDetectorRef.detectChanges();
    });
  }

  getFilmeleUtilizatoruluiCurent(aduDetaliiWikiDataSiActualizeazaListeUser: boolean, actualizeazaListeleUtilizatorului: boolean) {
    console.log("PROFILE - GET FILMELE USERULUI CURENT");
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [];
      console.log("PROFILE - listaFilmeUtilizator=", this.listaFilmeUtilizator);

      if(aduDetaliiWikiDataSiActualizeazaListeUser){
        this.getDetaliiFilmeWikiData(); //plus actualizare detalii
      }

      if(actualizeazaListeleUtilizatorului){
        this.seteazaInformatiiWikiDataPentruFilmeleUtilizatorului();
        this.actualizareTabele();
      }
    });
  }

  getDetaliiFilmeWikiData() {
    console.log("PROFILE - ADU DATE WIKIDATA");
    let coduriFilmeUtilizator = this.listaFilmeUtilizator.map(f=> f.codWikiData) || [];
    if(coduriFilmeUtilizator && coduriFilmeUtilizator.length> 0){
      this.filmService.getFilmeWikiDataDupaCoduri(coduriFilmeUtilizator).subscribe( (response) =>{
        this.listaFilmeWikiData = response ? response : [];

        this.seteazaInformatiiWikiDataPentruFilmeleUtilizatorului();
      });
    }
  }

  seteazaInformatiiWikiDataPentruFilmeleUtilizatorului(){
    console.log("PROFILE - ACTUALIZARE LISTE");
    this.listaFavoriteWikiData =
      this.getFilmeWikiDataDupaCoduri(this.listaFilmeUtilizator
        .filter(f => f.esteFavorit === true).map(f => f.codWikiData) || []);
    this.listaCompletedWikiData =
      this.getFilmeWikiDataDupaCoduri(this.listaFilmeUtilizator
        .filter(f => f.statusFilm === StatusFilmEnum.COMPLETED).map(f => f.codWikiData) || []);
    this.listaWatchingWikiData =
      this.getFilmeWikiDataDupaCoduri(this.listaFilmeUtilizator
        .filter(f => f.statusFilm === StatusFilmEnum.WATCHING).map(f => f.codWikiData) || []);
    this.listaPlanToWatchWikiData =
      this.getFilmeWikiDataDupaCoduri(this.listaFilmeUtilizator
        .filter(f => f.statusFilm === StatusFilmEnum.PLAN_TO_WATCH).map(f => f.codWikiData) || []);
  }

  getFilmeWikiDataDupaCoduri(coduriWikiData: string[]): any[]{
    let listaFilmeDupaCoduri: any[] = [];

    if(this.listaFilmeWikiData && coduriWikiData){
      coduriWikiData.forEach( cod => {
        let filmWikiData = this.listaFilmeWikiData.filter(f=> f.codWikiData === cod)[0] || {};
        listaFilmeDupaCoduri.push(filmWikiData);
      });
    }
    return listaFilmeDupaCoduri;
  }

  actualizareTabele(){
    console.log("PROFILE - ACTUALIZARE TABELE");
    /* actaualizare tabela favorite*/
    this.listaFavoriteComp.listaFilmeWikiData = this.listaFavoriteWikiData;
    this.listaFavoriteComp.initPaginatorAndMatTable();
    this.listaFavoriteComp.getPagina();
    /* actaualizare tabela completed*/
    this.listaCompletedComp.listaFilmeWikiData = this.listaCompletedWikiData;
    this.listaCompletedComp.initPaginatorAndMatTable();
    this.listaCompletedComp.getPagina();
    /* actaualizare tabela watching*/
    this.listaWatchingComp.listaFilmeWikiData = this.listaWatchingWikiData;
    this.listaWatchingComp.initPaginatorAndMatTable();
    this.listaWatchingComp.getPagina();
    /* actaualizare tabela plan to watch*/
    this.listaPlanToWatchComp.listaFilmeWikiData = this.listaPlanToWatchWikiData;
    this.listaPlanToWatchComp.initPaginatorAndMatTable();
    this.listaPlanToWatchComp.getPagina();

  }

}
