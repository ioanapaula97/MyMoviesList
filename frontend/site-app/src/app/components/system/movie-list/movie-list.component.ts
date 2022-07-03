import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {Utils} from "../../../utils/Utils";
import {MatTableDataSource} from "@angular/material/table";
import {MoviesListDisplayTypeEnum} from "../../../model/MoviesListDisplayTypeEnum";

@Component({
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.less']
})
export class MovieListComponent implements OnInit {

  @Input() displayType: string | undefined;
  @Input() pageSize: number | undefined;
  @Input() colMd: string | undefined;
  @Input() listaFilmeWikiData: any[];
  listaFilmeUtilizator: any[];
  coduriFilmeFavorite: string[];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  totalElements: number | undefined;
  paginaFilme: any[];

  tableDataSource: any;
  displayedColumns: string[] | undefined;
  filmStatusEnum: any[] = [
    {view: '', value: null},
    {view: 'COMPLETED', value: 'COMPLETED'},
    {view: 'PLAN TO WATCH', value: 'PLAN_TO_WATCH'},
    {view: 'WATCHING', value: 'WATCHING'}
  ];

  DISPLAY_TYPE = MoviesListDisplayTypeEnum;

  constructor(private filmService: FilmService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    if(!this.colMd) this.colMd = 'col-md-2';
    this.displayedColumns = this.displayType === this.DISPLAY_TYPE.LIST ? ['favorit', 'titlu', 'scorReview', 'anAparitie', 'durata', 'genuri' ]
      : ['statusFilm', 'titlu', 'scorReview', 'anAparitie', 'durata', 'genuri' ];
    this.getFilmeleUtilizatoruluiCurent();
    this.initPaginatorAndMatTable();
  }

  initPaginatorAndMatTable() {
    this.totalElements = this.listaFilmeWikiData.length;
    this.paginator.initialized.subscribe(() => this.getPagina());

    this.tableDataSource = new MatTableDataSource<any>(this.listaFilmeWikiData);
    this.tableDataSource.paginator = this.paginator;
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
