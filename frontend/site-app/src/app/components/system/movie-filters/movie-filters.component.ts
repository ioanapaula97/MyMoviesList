import {Component, OnInit, ViewChild} from '@angular/core';
import {TipSortareEnum} from "../../../model/TipSortareEnum";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {MovieListComponent} from "../movie-list/movie-list.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-movie-filters',
  templateUrl: './movie-filters.component.html',
  styleUrls: ['./movie-filters.component.less']
})
export class MovieFiltersComponent implements OnInit {

  @ViewChild('listaRezultat') listaRezultatComp:MovieListComponent;

  listaFilmeWikiData: any[];

  genuriFilmOptions: any[] = [
    {view: "Drama", value: "Q130232"},
    {view: "Science Fiction", value: "Q471839"},
    {view: "Romance", value: "Q1054574"},
    {view: "Action", value: "Q188473"},
    {view: "Historical", value: "Q17013749"},
    {view: "Horror", value: "Q200092"},
    {view: "Thriller", value: "Q2484376"},
    {view: "Based on a novel", value: "Q52207399"},
    {view: "Documentary", value: "Q93204"},
    {view: "Comedy", value: "Q157443"},
    {view: "Based on literature", value: "Q52162262"},
    {view: "Black comedy", value: "Q5778924"},
    {view: "Adventure", value: "Q319221"},
    {view: "Fantasy", value: "Q157394"}
  ]

  anSelectatOptions: any[] = [
    {view: "2022", value: 2022},
    {view: "2021", value: 2021},
    {view: "2020", value: 2020},
    {view: "2019", value: 2019},
    {view: "2018", value: 2018},
  ]

  sortareOptions: any[] = [
    {view: "Score ascending", value: TipSortareEnum.SCOR_ASC},
    {view: "Score descending", value: TipSortareEnum.SCOR_DESC}
  ]


  genuriSelectate: string[] = [];
  anSelectat: any;
  sortareSelectata: any;

  currentUrl: string | undefined;

  constructor(private filmService: FilmService,
              private userService: UserService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log("router=", this.router);
    console.log("activatedRoute=", this.activatedRoute);
    this.genuriFilmOptions = this.genuriFilmOptions.sort((a,b) => a.view.localeCompare(b.view));
    this.currentUrl = this.router.url;

    this.activatedRoute.queryParams.subscribe( params => {
      console.log("params= ", params);
      this.genuriSelectate = (params['GENRES'] || '').split(',');
      this.anSelectat = Number.parseInt((params['YEAR'] || ''));

      console.log("genuriSelectate= ", this.genuriSelectate);
      console.log("anSelectat= ", this.anSelectat);
      this.getData();
    });

  }

  selectGen() {
    // this.anSelectat = null;
    // this.sortareSelectata = null;
  }

  selectAn() {
    // this.genuriSelectate = [];
    // this.sortareSelectata = null;
  }

  getData() {
   if( this.genuriSelectate) {
       this.filmService.getFilmeDupaGenuri(this.genuriSelectate, this.sortareSelectata || TipSortareEnum.SCOR_DESC)
         .subscribe(res => {
           this.listaFilmeWikiData = res || [];
           console.log("GET DATA dupa genuri, genuri =", this.genuriSelectate, ", res=", res);
           this.listaRezultatComp.listaFilmeWikiData = this.listaFilmeWikiData;
           this.listaRezultatComp.getPagina();
         });

   }
    // if (this.anSelectat === null && this.genuriSelectate) {
    //   this.filmService.getFilmeDupaGenuri(this.genuriSelectate, this.sortareSelectata || TipSortareEnum.SCOR_DESC)
    //     .subscribe(res => {
    //       this.listaFilmeWikiData = res || [];
    //       console.log("GET DATA dupa genuri, genuri =", this.genuriSelectate, ", res=", res);
    //       this.listaRezultatComp.getPagina();
    //       // this.getPagina()/
    //     });
    //
    // }
    //
    // if (this.genuriSelectate === null && this.anSelectatOptions) {
    //   this.filmService.getFilmeDupaAnAparitie(this.anSelectat, this.sortareSelectata || TipSortareEnum.SCOR_DESC)
    //     .subscribe(res => {
    //       this.listaFilmeWikiData = res || [];
    //       console.log("GET DATA dupa an, an=", this.anSelectat, ", res=", res);
    //       this.listaRezultatComp.getPagina();
    //       // this.getPagina()
    //     });
    //
    // }
  }

  adaugaFiltreInUrlSiSchimbaRuta(){
    let urlCuFiltreActive = 'search';
    if (this.genuriSelectate && this.genuriSelectate.length > 0 ) urlCuFiltreActive += ('?GENRES=' + this.genuriSelectate);
    if (this.anSelectat) {
      urlCuFiltreActive.includes('?') ? urlCuFiltreActive += '&' : '?';
      urlCuFiltreActive += ('YEAR=' + this.anSelectat);
    }

    this.router.navigateByUrl(urlCuFiltreActive);
  }
}
