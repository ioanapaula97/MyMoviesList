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

  @Input() pageSize: number | undefined;
  @Input() colMd: string | undefined;
  @Input() listaFilmeWikiData: any[];
  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalElements: number | undefined;
  paginaFilme: any[];


  constructor(private filmService: FilmService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    if(!this.colMd) this.colMd = 'col-md-2';
    this.getFilmeleUtilizatoruluiCurent();
    this.totalElements = this.listaFilmeWikiData.length;
    this.paginator.initialized.subscribe(() => this.getPagina());
  }

  getPagina() {
    console.log('GET page ', this.paginator.pageSize, this.paginator.pageIndex);
    console.log("GET page lista=", this.listaFilmeWikiData);
    let startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    let endIndex = startIndex + this.paginator.pageSize;
    this.paginaFilme = this.listaFilmeWikiData.slice(startIndex, endIndex);
  }

  setFilmSelectat(film: any) {
    Utils.setFilmWikiDataSelectatInLocalStorage(film);
  }

  getFilmeleUtilizatoruluiCurent() {
    console.log("GET FILMELE USERULUI CURENT");
    this.filmService.getFilmeleUtilizatorului(this.userService.getIdUtilizatorCurent()).subscribe((resp) => {
      this.listaFilmeUtilizator = resp ? resp : [];
      this.coduriFilmeFavorite = Utils.getCoduriFilmeFavorite(this.listaFilmeUtilizator);
      console.log("listaFilmeUtilizator=", this.listaFilmeUtilizator);
      console.log("coduriFilmeFavorite=", this.coduriFilmeFavorite);
    });
  }

}
