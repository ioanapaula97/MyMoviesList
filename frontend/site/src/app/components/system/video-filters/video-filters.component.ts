import { Component, OnInit } from '@angular/core';
import {TipSortareEnum} from "../../../model/TipSortareEnum";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";

@Component({
  selector: 'app-video-filters',
  templateUrl: './video-filters.component.html',
  styleUrls: ['./video-filters.component.less']
})
export class VideoFiltersComponent implements OnInit {

  listaFilmeWikiData: any[];

  genuriFilmOptions: any[] = [
    {view: "", value: null},
    {view: "Drama", value: "Q130232"},
    {view: "Science Fiction", value: "Q24925"},
    {view: "Romance", value: "Q1054574"},
    {view: "Action", value: "Q188473"},
    {view: "Historical", value: "Q17013749"},
  ]

  anSelectatOptions: any[] = [
    {view: "", value: null},
    {view: "2022", value: 2022},
    {view: "2021", value: 2021},
    {view: "2020", value: 2020},
    {view: "2019", value: 2019},
    {view: "2018", value: 2018},
  ]

  sortareOptions: any[] = [
    {view: "", value: null},
    {view: "Score ascending", value: TipSortareEnum.SCOR_ASC},
    {view: "Score descending", value: TipSortareEnum.SCOR_DESC}
  ]


  genSelectat = [];
  anSelectat:any;
  sortareSelectata:any;

  constructor(private filmService: FilmService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.filmService.getFilmeDupaTopScor().subscribe((resp) => {
      this.listaFilmeWikiData = resp ? resp : [] ;
    });
  }

  selectGen(){
    this.anSelectat = null;
    // this.sortareSelectata = null;
  }

  selectAn(){
    this.genSelectat = [];
    // this.sortareSelectata = null;
  }

  getData(){
    if(this.anSelectat === null && this.genSelectat) {
      this.filmService.getFilmeDupaGenuri(this.genSelectat, this.sortareSelectata || TipSortareEnum.SCOR_DESC)
        .subscribe( res => {
          this.listaFilmeWikiData = res || [];
          console.log("GET DATA dupa genuri, genuri =", this.genSelectat, ", res=", res);
          this.getPagina()
        });

    }

    if(this.genSelectat === null && this.anSelectatOptions) {
      this.filmService.getFilmeDupaAnAparitie(this.anSelectat, this.sortareSelectata || TipSortareEnum.SCOR_DESC)
        .subscribe( res => {
          this.listaFilmeWikiData = res || [];
          console.log("GET DATA dupa an, an=", this.anSelectat, ", res=", res);
          this.getPagina()
        });

    }
  }

  getPagina(){

  }

}
