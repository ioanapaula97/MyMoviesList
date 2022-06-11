import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {Utils} from "../../../utils/Utils";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.less']
})
export class MovieListComponent implements OnInit {

  @Input() listaFilmeWikiData: any[];
  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalElements: number;
  paginaFilme: any[];


  constructor(private filmService: FilmService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.getFilmeleUtilizatoruluiCurent();
    this.paginator.initialized.subscribe(() => this.getPagina());
  }

  getPagina() {
    console.log('GET page ', this.paginator.pageSize, this.paginator.pageIndex);
    let startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    let endIndex = startIndex + this.paginator.pageSize;
    this.paginaFilme = this.listaFilmeWikiData.slice(startIndex, endIndex);
    this.totalElements = this.listaFilmeWikiData.length;
  }

  setFilmSelectat(film: any) {
    localStorage.setItem('filmSelectat', JSON.stringify(film));
  }

  getTooltip(film: any): string {
    return Utils.getTooltipButonFavorite(film.codWikiData, this.coduriFilmeFavorite);
  }

  schimbaFavorite(film: any) {
    if (this.filmulEsteFavorit(film)) {
      this.filmService.eliminaFilmDeLaFavorite(this.userService.getIdUtilizatorCurent(), film.codWikiData)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    } else {
      this.filmService.adaugaFilmLaFavorite(this.userService.getIdUtilizatorCurent(), film.codWikiData)
        .subscribe(res => this.getFilmeleUtilizatoruluiCurent());
    }

  }

  filmulEsteFavorit(film: any) {
    return Utils.filmulEsteFavorit(film.codWikiData, this.coduriFilmeFavorite);
  }

  getFilmeleUtilizatoruluiCurent() {
    console.log("GET FILMELE USERULUI CURENT");
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [];
      this.coduriFilmeFavorite = this.getCoduriFilmeFavorite(this.listaFilmeUtilizator);
      console.log("listaFilmeUtilizator=", this.listaFilmeUtilizator);
      console.log("coduriFilmeFavorite=", this.coduriFilmeFavorite);
    });
  }

  getCoduriFilmeFavorite(listaFilmeUtilizator: any[]): string[] {
    let coduriFavorite: string[] = [];

    if (listaFilmeUtilizator && listaFilmeUtilizator.length > 0) {
      coduriFavorite = listaFilmeUtilizator.filter(f => f.esteFavorit === true).map(f => f.codWikiData) || [];
    }

    return coduriFavorite;
  }

}
