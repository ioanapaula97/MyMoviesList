import {Component, OnInit, ViewChild} from '@angular/core';
import {TipSortareEnum} from "../../../model/TipSortareEnum";
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {MovieListComponent} from "../../system/movie-list/movie-list.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Utils} from "../../../utils/Utils";
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MatDatepicker} from "@angular/material/datepicker";
import {MoviesListDisplayTypeEnum} from "../../../model/MoviesListDisplayTypeEnum";
import {QueryParamsEnum} from "../../../model/QueryParamsEnum";

// declare var require: any;
// const speech = require('@google-cloud/speech');
// const fs = require('fs');



export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-movie-filters',
  templateUrl: './movie-filters.component.html',
  styleUrls: ['./movie-filters.component.less'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}]
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
  ];

  scorOptions: any[] = [
    {view: "10", value: 10},
    {view: "20", value: 20},
    {view: "30", value: 30},
    {view: "40", value: 40},
    {view: "60", value: 60},
    {view: "70", value: 70},
    {view: "80", value: 80},
    {view: "90", value: 90},
  ];

  @ViewChild('picker', {static: false}) private picker: MatDatepicker<Date>;
  yearPicked: any;

  sortareOptions: any[] = [
    {view: "Score descending", value: TipSortareEnum.SCOR_DESC},
    {view: "Score ascending", value: TipSortareEnum.SCOR_ASC},
    {view: "Date descending", value: TipSortareEnum.DATA_DESC},
    {view: "Date ascending", value: TipSortareEnum.DATA_ASC}
  ]
  DISPLAY_TYPE = MoviesListDisplayTypeEnum;
  currentUrl: string | undefined;

  FILTER_SEARCH: boolean = false;
  QUESTION_SEARCH: boolean = false;
  ACTOR_SAU_GEN: boolean = false;
  genParam: any;
  actorParam: any;

  genuriSelectate: string[] = [];
  anSelectat: any;
  scorSelectat: any;
  sortareSelectata: any;

  intrebare: string = '';
  raspunsIntrebare: string|undefined;

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

    this.seteazaFiltreDinUrlSiEfectuareCautare();

  }

  selectGen() { //genChanged
  }

  textareaChange($event:any){
    // console.log( 'textarea input change, $event=', $event.target.value);
    console.log( 'textarea input change, intrebare=', this.intrebare);
  }

  seteazaFiltreDinUrlSiEfectuareCautare(){
    this.activatedRoute.queryParams.subscribe( params => {
      console.log("params= ", params);
      this.genuriSelectate = (params[QueryParamsEnum.GENRES] || '').split(',');
      this.anSelectat = Number.parseInt((params[QueryParamsEnum.YEAR] || ''));
      if(this.anSelectat){
        let year = new Date(); year.setFullYear(this.anSelectat, 1, 1);
        this.yearPicked =  year;
      }
      this.scorSelectat = Number.parseInt((params[QueryParamsEnum.SCORE] || ''));
      this.sortareSelectata = (params[QueryParamsEnum.SORT] || '') || '';

      this.genParam = Utils.getGenSelectatDinLocalStorage() || {};
      this.actorParam = Utils.getActorSelectatDinLocalStorage() || {};

      console.log("genuriSelectate= ", this.genuriSelectate);
      console.log("anSelectat= ", this.anSelectat);
      console.log("scorSelectat= ", this.scorSelectat);
      console.log("sortareSelectata= ", this.sortareSelectata);
      console.log("genParam= ", this.genParam);
      console.log("actorParam= ", this.actorParam);
      // if(this.anSelectat) console.log("anSelectat in if ", this.anSelectat);
      // else{ console.log("anSelectat in else ", this.anSelectat);}

      let filtreActive = this.router.url.split('search')[1] || '';
      console.log('filtreActive: ', filtreActive);

      this.seteazaTipRaspuns(filtreActive);
      if(filtreActive){
        this.getData(filtreActive);
      }
    });
  }

  seteazaTipRaspuns(filtreActive: string){
    if(filtreActive.includes(QueryParamsEnum.GENRES + '=') || filtreActive.includes(QueryParamsEnum.YEAR + '=') ||
       filtreActive.includes(QueryParamsEnum.SCORE + '=') || filtreActive.includes(QueryParamsEnum.SORT + '=')){
      this.ACTOR_SAU_GEN = false;
      this.FILTER_SEARCH = true;
      this.QUESTION_SEARCH = false;
      this.raspunsIntrebare = undefined;
    }
    if(filtreActive.includes(QueryParamsEnum.QUESTION + '=')){
      this.ACTOR_SAU_GEN = false;
      this.FILTER_SEARCH = false;
      this.QUESTION_SEARCH = true;
      this.listaFilmeWikiData = [];

      this.genuriSelectate = [];
      this.anSelectat = Number.parseInt('');
      this.scorSelectat = Number.parseInt('');
      this.sortareSelectata = '';
      this.yearPicked = undefined;
    }

    if(filtreActive.includes(QueryParamsEnum.GEN + '=') || filtreActive.includes(QueryParamsEnum.ACTOR + '=')){
      if(filtreActive.includes(QueryParamsEnum.GEN + '=')){
        this.actorParam = undefined;
      }
      if(filtreActive.includes(QueryParamsEnum.ACTOR + '=')){
        this.genParam = undefined;
      }
      this.ACTOR_SAU_GEN = true;
      this.FILTER_SEARCH = false;
      this.QUESTION_SEARCH = false;
      this.raspunsIntrebare = undefined;
      this.listaFilmeWikiData = [];

      this.genuriSelectate = [];
      this.anSelectat = Number.parseInt('');
      this.scorSelectat = Number.parseInt('');
      this.sortareSelectata = '';
      this.yearPicked = undefined;
    }

    if(!filtreActive.includes('?')){
      this.actorParam = undefined;
      this.genParam = undefined;
      this.ACTOR_SAU_GEN = false;
      this.FILTER_SEARCH = true;
      this.QUESTION_SEARCH = false;
      this.raspunsIntrebare = undefined;
      this.listaFilmeWikiData = [];

      this.genuriSelectate = [];
      this.anSelectat = Number.parseInt('');
      this.scorSelectat = Number.parseInt('');
      this.sortareSelectata = '';
      this.yearPicked = undefined;
    }

  }

  getData(filtreActive: string) {
    console.log("GET DATA");

    if(filtreActive.includes(QueryParamsEnum.QUESTION)){
      this.filmService.getRaspunsIntrebare(filtreActive)
        .subscribe( res =>{
          this.raspunsIntrebare = res ? res.raspuns : '';
        });
    } else {
      this.filmService.getFilmeDupaFiltre(filtreActive)
        .subscribe(res => {
          // let res = [{"codWikiData":"Q200299","titlu":"All About Eve","descriere":"1950 film by Joseph L. Mankiewicz","anAparitie":"1950","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Bette%20Davis%20and%20Gary%20Merrill%20in%20All%20About%20Eve.jpg","durata":"138","scorReview":"99%","director":null,"actori":[{"numeActor":"Marilyn Monroe","codWikiData":"Q4616"},{"numeActor":"Bette Davis","codWikiData":"Q71206"},{"numeActor":"Barbara Bates","codWikiData":"Q204750"},{"numeActor":"Celeste Holm","codWikiData":"Q212957"},{"numeActor":"Anne Baxter","codWikiData":"Q228906"},{"numeActor":"Thelma Ritter","codWikiData":"Q229266"},{"numeActor":"George Sanders","codWikiData":"Q296491"},{"numeActor":"Snub Pollard","codWikiData":"Q474943"},{"numeActor":"Bess Flowers","codWikiData":"Q513849"},{"numeActor":"Gary Merrill","codWikiData":"Q562339"},{"numeActor":"Craig Hill","codWikiData":"Q945494"},{"numeActor":"Franklyn Farnum","codWikiData":"Q1273140"},{"numeActor":"Hugh Marlowe","codWikiData":"Q1334264"},{"numeActor":"Gregory Ratoff","codWikiData":"Q1361039"},{"numeActor":"Steven Geray","codWikiData":"Q1667630"},{"numeActor":"Walter Hampden","codWikiData":"Q3565777"},{"numeActor":"Harold Miller","codWikiData":"Q17322152"},{"numeActor":"Jack Chefe","codWikiData":"Q20723206"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"comedy","codWikiData":"Q157443"},{"denumireGen":"based on literature","codWikiData":"Q52162262"}]},{"codWikiData":"Q17183770","titlu":"Selma","descriere":"2014 American historical film by Ava DuVernay","anAparitie":"2014","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Bloody%20Sunday-Alabama%20police%20attack.jpeg","durata":"127","scorReview":"99%","director":null,"actori":[{"numeActor":"Tim Roth","codWikiData":"Q203804"},{"numeActor":"Tom Wilkinson","codWikiData":"Q211322"},{"numeActor":"David Oyelowo","codWikiData":"Q218800"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"biographical","codWikiData":"Q645928"},{"denumireGen":"historical","codWikiData":"Q17013749"}]},{"codWikiData":"Q24815","titlu":"Citizen Kane","descriere":"1941 American drama film directed by Orson Welles","anAparitie":"1941","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Citizen%20Kane%20poster%2C%201941%20%28Style%20B%2C%20unrestored%29.jpg","durata":"119","scorReview":"99%","director":null,"actori":[{"numeActor":"Joseph Cotten","codWikiData":"Q95148"},{"numeActor":"Gregg Toland","codWikiData":"Q166000"},{"numeActor":"Dorothy Comingore","codWikiData":"Q221874"},{"numeActor":"Agnes Moorehead","codWikiData":"Q231221"},{"numeActor":"Alan Ladd","codWikiData":"Q346280"},{"numeActor":"Ruth Warrick","codWikiData":"Q456375"},{"numeActor":"Everett Sloane","codWikiData":"Q600233"},{"numeActor":"William Alland","codWikiData":"Q925872"},{"numeActor":"Paul Stewart","codWikiData":"Q1385381"},{"numeActor":"Gus Schilling","codWikiData":"Q1387120"},{"numeActor":"Fortunio Bonanova","codWikiData":"Q1439141"},{"numeActor":"George Coulouris","codWikiData":"Q1507169"},{"numeActor":"Ray Collins","codWikiData":"Q1550341"},{"numeActor":"Philip Van Zandt","codWikiData":"Q2464819"},{"numeActor":"Charles Bennett","codWikiData":"Q2958529"},{"numeActor":"Erskine Sanford","codWikiData":"Q3057498"},{"numeActor":"Harry Shannon","codWikiData":"Q3127914"},{"numeActor":"Sonny Bupp","codWikiData":"Q3490635"},{"numeActor":"Buddy Swan","codWikiData":"Q4984951"},{"numeActor":"Walter Sande","codWikiData":"Q5421985"},{"numeActor":"Georgia Backus","codWikiData":"Q5547351"},{"numeActor":"Gino Corrado","codWikiData":"Q5563216"},{"numeActor":"Roland Winters","codWikiData":"Q7360500"},{"numeActor":"Orson Welles","codWikiData":"Q24829"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"biographical","codWikiData":"Q645928"},{"denumireGen":"fiction","codWikiData":"Q12912091"},{"denumireGen":"flashback","codWikiData":"Q21401869"}]},{"codWikiData":"Q193570","titlu":"Sunset Boulevard","descriere":"1950 film by Billy Wilder","anAparitie":"1950","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Sunset%20Boulevard%20%281950%20poster%29.jpg","durata":"110","scorReview":"99%","director":null,"actori":[{"numeActor":"Cecil B. DeMille","codWikiData":"Q72267"},{"numeActor":"Erich von Stroheim","codWikiData":"Q78508"},{"numeActor":"William Holden","codWikiData":"Q95002"},{"numeActor":"Buster Keaton","codWikiData":"Q103949"},{"numeActor":"Gloria Swanson","codWikiData":"Q229232"},{"numeActor":"Nancy Olson","codWikiData":"Q259453"},{"numeActor":"Hedda Hopper","codWikiData":"Q271324"},{"numeActor":"Anna Q. Nilsson","codWikiData":"Q434466"},{"numeActor":"Yvette Vickers","codWikiData":"Q443121"},{"numeActor":"Ray Evans","codWikiData":"Q526861"},{"numeActor":"Archie R. Dalzell","codWikiData":"Q633967"},{"numeActor":"Jay Livingston","codWikiData":"Q947044"},{"numeActor":"Franklyn Farnum","codWikiData":"Q1273140"},{"numeActor":"Eddie Dew","codWikiData":"Q1282757"},{"numeActor":"Jack Webb","codWikiData":"Q1287651"},{"numeActor":"Henry Wilcoxon","codWikiData":"Q1372180"},{"numeActor":"H. B. Warner","codWikiData":"Q1562547"},{"numeActor":"Creighton Hale","codWikiData":"Q1754382"},{"numeActor":"Gertrude Astor","codWikiData":"Q2004176"},{"numeActor":"E. Mason Hopper","codWikiData":"Q2054936"},{"numeActor":"Fred Clark","codWikiData":"Q2484213"},{"numeActor":"Frank O'Connor","codWikiData":"Q3082744"},{"numeActor":"Julia Faye","codWikiData":"Q3189043"},{"numeActor":"Larry J. Blake","codWikiData":"Q3218062"},{"numeActor":"Lloyd Gough","codWikiData":"Q3257528"},{"numeActor":"Robert Emmett O'Connor","codWikiData":"Q3435051"},{"numeActor":"Al Ferguson","codWikiData":"Q3607492"},{"numeActor":"Harold Miller","codWikiData":"Q17322152"},{"numeActor":"Bert Moorhouse","codWikiData":"Q18645982"},{"numeActor":"Fred Aldrich","codWikiData":"Q18811091"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"noir","codWikiData":"Q185867"},{"denumireGen":"flashback","codWikiData":"Q21401869"}]},{"codWikiData":"Q272599","titlu":"All Quiet on the Western Front","descriere":"1930 American epic war film","anAparitie":"1930","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/All%20Quiet%20on%20the%20Western%20Front%20%281930%20film%29%20poster.jpg","durata":"136","scorReview":"98%","director":null,"actori":[{"numeActor":"Joan Marsh","codWikiData":"Q2615512"},{"numeActor":"Frederick Kohner","codWikiData":"Q2656718"},{"numeActor":"Edmund Breese","codWikiData":"Q3048083"},{"numeActor":"Harold Goodwin","codWikiData":"Q3127608"},{"numeActor":"Richard Alexander","codWikiData":"Q3430461"},{"numeActor":"Fred Zinnemann","codWikiData":"Q55420"},{"numeActor":"Wolfgang Staudte","codWikiData":"Q69159"},{"numeActor":"ZaSu Pitts","codWikiData":"Q136646"},{"numeActor":"John Ray","codWikiData":"Q316949"},{"numeActor":"Louis Wolheim","codWikiData":"Q357363"},{"numeActor":"Lew Ayres","codWikiData":"Q444371"},{"numeActor":"Arnold Lucy","codWikiData":"Q695704"},{"numeActor":"Arthur Gardner","codWikiData":"Q718752"},{"numeActor":"John Wray","codWikiData":"Q912559"},{"numeActor":"Edwin Maxwell","codWikiData":"Q1294814"},{"numeActor":"Ben Alexander","codWikiData":"Q1378858"},{"numeActor":"Robert Parrish","codWikiData":"Q1386549"},{"numeActor":"William Lincoln Bakewell","codWikiData":"Q1414971"},{"numeActor":"G. Pat Collins","codWikiData":"Q1484304"},{"numeActor":"Russell Gleason","codWikiData":"Q1669115"},{"numeActor":"Beryl Mercer","codWikiData":"Q2065508"},{"numeActor":"Slim Summerville","codWikiData":"Q2294197"},{"numeActor":"Yola d'Avril","codWikiData":"Q8462262"},{"numeActor":"William Irving","codWikiData":"Q15486008"},{"numeActor":"Maurice Murphy","codWikiData":"Q28727220"},{"numeActor":"Bertha Mann","codWikiData":"Q50317637"},{"numeActor":"Vince Barnett","codWikiData":"Q3559408"},{"numeActor":"William Bakewell","codWikiData":"Q3568410"},{"numeActor":"Bodil Rosing","codWikiData":"Q4936600"},{"numeActor":"Ellen Hall","codWikiData":"Q5364861"},{"numeActor":"Heinie Conklin","codWikiData":"Q5699738"},{"numeActor":"Raymond Griffith","codWikiData":"Q5771549"},{"numeActor":"Owen Davis, Jr.","codWikiData":"Q7114447"},{"numeActor":"Scott Kolk","codWikiData":"Q7436631"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"war","codWikiData":"Q369747"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q272599","titlu":"All Quiet on the Western Front","descriere":"1930 American epic war film","anAparitie":"1930","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/All%20Quiet%20on%20the%20Western%20Front%20%281930%20film%29%20poster.jpg","durata":"136","scorReview":"98%","director":null,"actori":[{"numeActor":"Frederick Kohner","codWikiData":"Q2656718"},{"numeActor":"Edmund Breese","codWikiData":"Q3048083"},{"numeActor":"Harold Goodwin","codWikiData":"Q3127608"},{"numeActor":"Richard Alexander","codWikiData":"Q3430461"},{"numeActor":"Vince Barnett","codWikiData":"Q3559408"},{"numeActor":"Fred Zinnemann","codWikiData":"Q55420"},{"numeActor":"Wolfgang Staudte","codWikiData":"Q69159"},{"numeActor":"ZaSu Pitts","codWikiData":"Q136646"},{"numeActor":"John Ray","codWikiData":"Q316949"},{"numeActor":"Louis Wolheim","codWikiData":"Q357363"},{"numeActor":"Lew Ayres","codWikiData":"Q444371"},{"numeActor":"Arnold Lucy","codWikiData":"Q695704"},{"numeActor":"Arthur Gardner","codWikiData":"Q718752"},{"numeActor":"John Wray","codWikiData":"Q912559"},{"numeActor":"Edwin Maxwell","codWikiData":"Q1294814"},{"numeActor":"Ben Alexander","codWikiData":"Q1378858"},{"numeActor":"Robert Parrish","codWikiData":"Q1386549"},{"numeActor":"William Lincoln Bakewell","codWikiData":"Q1414971"},{"numeActor":"G. Pat Collins","codWikiData":"Q1484304"},{"numeActor":"Russell Gleason","codWikiData":"Q1669115"},{"numeActor":"Beryl Mercer","codWikiData":"Q2065508"},{"numeActor":"Slim Summerville","codWikiData":"Q2294197"},{"numeActor":"Joan Marsh","codWikiData":"Q2615512"},{"numeActor":"William Irving","codWikiData":"Q15486008"},{"numeActor":"Maurice Murphy","codWikiData":"Q28727220"},{"numeActor":"Bertha Mann","codWikiData":"Q50317637"},{"numeActor":"William Bakewell","codWikiData":"Q3568410"},{"numeActor":"Bodil Rosing","codWikiData":"Q4936600"},{"numeActor":"Ellen Hall","codWikiData":"Q5364861"},{"numeActor":"Heinie Conklin","codWikiData":"Q5699738"},{"numeActor":"Raymond Griffith","codWikiData":"Q5771549"},{"numeActor":"Owen Davis, Jr.","codWikiData":"Q7114447"},{"numeActor":"Scott Kolk","codWikiData":"Q7436631"},{"numeActor":"Yola d'Avril","codWikiData":"Q8462262"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"war","codWikiData":"Q369747"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q483941","titlu":"Schindler's List","descriere":"1993 film by Steven Spielberg","anAparitie":"1993","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Schindlers%20List%20logo.png","durata":"195","scorReview":"98%","director":null,"actori":[{"numeActor":"Ralph Fiennes","codWikiData":"Q28493"},{"numeActor":"Maciej Kozłowski","codWikiData":"Q55389"},{"numeActor":"Liam Neeson","codWikiData":"Q58444"},{"numeActor":"Götz Otto","codWikiData":"Q62676"},{"numeActor":"Erwin Leder","codWikiData":"Q86767"},{"numeActor":"Alexander Held","codWikiData":"Q87676"},{"numeActor":"Thomas Morris","codWikiData":"Q88303"},{"numeActor":"August Schmölzer","codWikiData":"Q88583"},{"numeActor":"Ludger Pistor","codWikiData":"Q95316"},{"numeActor":"Martin Semmelrogge","codWikiData":"Q95580"},{"numeActor":"Jochen Nickel","codWikiData":"Q97604"},{"numeActor":"Joachim Paul Assböck","codWikiData":"Q106744"},{"numeActor":"Wilhelm Manske","codWikiData":"Q118053"},{"numeActor":"Norbert Weisser","codWikiData":"Q121045"},{"numeActor":"Ben Kingsley","codWikiData":"Q173158"},{"numeActor":"Caroline Goodall","codWikiData":"Q201976"},{"numeActor":"Embeth Davidtz","codWikiData":"Q260622"},{"numeActor":"Maria Peszek","codWikiData":"Q274836"},{"numeActor":"Elina Löwensohn","codWikiData":"Q450694"},{"numeActor":"Maja Ostaszewska","codWikiData":"Q450928"},{"numeActor":"Andrzej Seweryn","codWikiData":"Q515592"},{"numeActor":"Beatrice Macola","codWikiData":"Q526864"},{"numeActor":"Branko Lustig","codWikiData":"Q703611"},{"numeActor":"Małgorzata Gebel","codWikiData":"Q771165"},{"numeActor":"Bettina Kupfer","codWikiData":"Q850004"},{"numeActor":"Mark Ivanir","codWikiData":"Q1033909"},{"numeActor":"Edward Linde-Lubaszenko","codWikiData":"Q1292876"},{"numeActor":"Jonathan Sagall","codWikiData":"Q1356584"},{"numeActor":"Friedrich von Thun","codWikiData":"Q1464037"},{"numeActor":"Geno Lechner","codWikiData":"Q1502443"},{"numeActor":"Alexander Strobele","codWikiData":"Q1521335"},{"numeActor":"Hans-Jörg Assmann","codWikiData":"Q1577563"},{"numeActor":"Hans-Michael Rehberg","codWikiData":"Q1577938"},{"numeActor":"Henryk Bista","codWikiData":"Q1607467"},{"numeActor":"Olaf Lubaszenko","codWikiData":"Q1937615"},{"numeActor":"Agnieszka Wagner","codWikiData":"Q2826948"},{"numeActor":"Anna Mucha","codWikiData":"Q2850579"},{"numeActor":"Paweł Deląg","codWikiData":"Q3373190"},{"numeActor":"Jan Jurewicz","codWikiData":"Q5015744"},{"numeActor":"Tadeusz Huk","codWikiData":"Q5101571"},{"numeActor":"Piotr Polk","codWikiData":"Q7197001"},{"numeActor":"Rami Heuberger","codWikiData":"Q7289526"},{"numeActor":"Wojciech Klata","codWikiData":"Q8029127"},{"numeActor":"Jerzy Nowak","codWikiData":"Q8338880"},{"numeActor":"Grzegorz Damięcki","codWikiData":"Q9281760"},{"numeActor":"Tadeusz Bradecki","codWikiData":"Q9354107"},{"numeActor":"Ezra Dagan","codWikiData":"Q15762190"},{"numeActor":"Razia Israeli","codWikiData":"Q16129016"},{"numeActor":"Miri Fabian","codWikiData":"Q81968984"},{"numeActor":"Grzegorz Kwas","codWikiData":"Q111472798"},{"numeActor":"Daniel Del Ponte","codWikiData":"Q111472800"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"war","codWikiData":"Q369747"},{"denumireGen":"biographical","codWikiData":"Q645928"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q189505","titlu":"Jaws","descriere":"1975 American thriller film directed by Steven Spielberg","anAparitie":"1975","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Jaws%20Book%201975%20Cover.jpg","durata":"124","scorReview":"98%","director":null,"actori":[{"numeActor":"Steven Spielberg","codWikiData":"Q8877"},{"numeActor":"Richard Dreyfuss","codWikiData":"Q181799"},{"numeActor":"Roy Scheider","codWikiData":"Q216569"},{"numeActor":"Lorraine Gary","codWikiData":"Q266942"},{"numeActor":"Robert Shaw","codWikiData":"Q313727"},{"numeActor":"Peter Benchley","codWikiData":"Q333251"},{"numeActor":"Murray Hamilton","codWikiData":"Q978706"},{"numeActor":"Carl Gottlieb","codWikiData":"Q1038375"},{"numeActor":"Susan Backlinie","codWikiData":"Q3978222"},{"numeActor":"Craig Kingsbury","codWikiData":"Q24633811"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"horror","codWikiData":"Q200092"},{"denumireGen":"thriller","codWikiData":"Q2484376"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q61448040","titlu":"Parasite","descriere":"2019 film directed by Bong Joon-ho","anAparitie":"2019","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Parasite%20%28film%29%20director%20and%20cast%20in%202019.jpg","durata":"132","scorReview":"98%","director":null,"actori":[{"numeActor":"Jang Hye-jin","codWikiData":"Q55733858"},{"numeActor":"Song Kang-ho","codWikiData":"Q484400"},{"numeActor":"Lee Sun-kyun","codWikiData":"Q489681"},{"numeActor":"Choi Woo-shik","codWikiData":"Q492701"},{"numeActor":"Cho Yeo-jeong","codWikiData":"Q626347"},{"numeActor":"Park Seo-joon","codWikiData":"Q5116234"},{"numeActor":"Jung Ji-so","codWikiData":"Q16177322"},{"numeActor":"Park So-dam","codWikiData":"Q18700040"},{"numeActor":"Lee Jung-eun","codWikiData":"Q21710318"},{"numeActor":"Park Myung-hoon","codWikiData":"Q24867395"}],"genuri":[{"denumireGen":"comedy","codWikiData":"Q157443"},{"denumireGen":"thriller","codWikiData":"Q2484376"},{"denumireGen":"black comedy","codWikiData":"Q53094"},{"denumireGen":"drama","codWikiData":"Q130232"}]},{"codWikiData":"Q135465","titlu":"Rashomon","descriere":"1950 film by Akira Kurosawa","anAparitie":"1951","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Rashomon%20poster.jpg","durata":"88","scorReview":"98%","director":null,"actori":[{"numeActor":"Toshirō Mifune","codWikiData":"Q37001"},{"numeActor":"Takashi Shimura","codWikiData":"Q40070"},{"numeActor":"Machiko Kyō","codWikiData":"Q180602"},{"numeActor":"Minoru Chiaki","codWikiData":"Q975630"},{"numeActor":"Masayuki Mori","codWikiData":"Q2590475"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"samurai cinema","codWikiData":"Q169672"},{"denumireGen":"crime","codWikiData":"Q959790"},{"denumireGen":"flashback","codWikiData":"Q21401869"},{"denumireGen":"based on literature","codWikiData":"Q52162262"}]},{"codWikiData":"Q45386","titlu":"Invasion of the Body Snatchers","descriere":"1956 US science fiction film directed by Don Siegel","anAparitie":"1956","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Dana%20Wynter%20and%20Kevin%20McCarthy.jpg","durata":"80","scorReview":"98%","director":null,"actori":[{"numeActor":"Sam Peckinpah","codWikiData":"Q51461"},{"numeActor":"Dana Wynter","codWikiData":"Q63189"},{"numeActor":"Carolyn Jones","codWikiData":"Q238895"},{"numeActor":"Virginia Christine","codWikiData":"Q275543"},{"numeActor":"Kevin McCarthy","codWikiData":"Q281404"},{"numeActor":"Whit Bissell","codWikiData":"Q329156"},{"numeActor":"Dabbs Greer","codWikiData":"Q640001"},{"numeActor":"Larry Gates","codWikiData":"Q749735"},{"numeActor":"Richard Deacon","codWikiData":"Q1289785"},{"numeActor":"Bobby Clark","codWikiData":"Q2000363"},{"numeActor":"Ralph Dumke","codWikiData":"Q3418248"},{"numeActor":"Frank Hagney","codWikiData":"Q5487056"},{"numeActor":"King Donovan","codWikiData":"Q11021151"},{"numeActor":"Tom Fadden","codWikiData":"Q19559859"}],"genuri":[{"denumireGen":"horror","codWikiData":"Q200092"},{"denumireGen":"science fiction","codWikiData":"Q471839"},{"denumireGen":"alien invasion","codWikiData":"Q2447078"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q105702","titlu":"Dr. Strangelove","descriere":"1964 British satire film directed by Stanley Kubrick","anAparitie":"1964","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Dr%20Strangelove%20movie%20logo.png","durata":"93","scorReview":"98%","director":null,"actori":[{"numeActor":"Peter Sellers","codWikiData":"Q177984"},{"numeActor":"George C. Scott","codWikiData":"Q182450"},{"numeActor":"James Earl Jones","codWikiData":"Q203960"},{"numeActor":"Sterling Hayden","codWikiData":"Q323166"},{"numeActor":"Shane Rimmer","codWikiData":"Q674451"},{"numeActor":"Keenan Wynn","codWikiData":"Q946859"},{"numeActor":"Slim Pickens","codWikiData":"Q1277039"},{"numeActor":"Jack Creley","codWikiData":"Q1677002"},{"numeActor":"Peter Bull","codWikiData":"Q1712232"},{"numeActor":"Tracy Reed","codWikiData":"Q4974291"},{"numeActor":"Gordon Tanner","codWikiData":"Q5585899"},{"numeActor":"Frank Berry","codWikiData":"Q21213208"},{"numeActor":"Robert O'Neil","codWikiData":"Q21213224"},{"numeActor":"Glenn Beck","codWikiData":"Q21213245"},{"numeActor":"Roy Stephens","codWikiData":"Q21213264"},{"numeActor":"Hal Galili","codWikiData":"Q21213287"},{"numeActor":"Paul Tamarin","codWikiData":"Q21213307"},{"numeActor":"Laurence Herder","codWikiData":"Q21213320"},{"numeActor":"John McCarthy","codWikiData":"Q21213333"}],"genuri":[{"denumireGen":"comedy","codWikiData":"Q157443"},{"denumireGen":"war","codWikiData":"Q369747"},{"denumireGen":"satirical","codWikiData":"Q3745430"},{"denumireGen":"black comedy","codWikiData":"Q5778924"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q105702","titlu":"Dr. Strangelove","descriere":"1964 British satire film directed by Stanley Kubrick","anAparitie":"1964","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Dr%20Strangelove%20movie%20logo.png","durata":"102","scorReview":"98%","director":null,"actori":[{"numeActor":"Peter Sellers","codWikiData":"Q177984"},{"numeActor":"George C. Scott","codWikiData":"Q182450"},{"numeActor":"James Earl Jones","codWikiData":"Q203960"},{"numeActor":"Sterling Hayden","codWikiData":"Q323166"},{"numeActor":"Shane Rimmer","codWikiData":"Q674451"},{"numeActor":"Keenan Wynn","codWikiData":"Q946859"},{"numeActor":"Slim Pickens","codWikiData":"Q1277039"},{"numeActor":"Jack Creley","codWikiData":"Q1677002"},{"numeActor":"Peter Bull","codWikiData":"Q1712232"},{"numeActor":"Tracy Reed","codWikiData":"Q4974291"},{"numeActor":"Gordon Tanner","codWikiData":"Q5585899"},{"numeActor":"Frank Berry","codWikiData":"Q21213208"},{"numeActor":"Robert O'Neil","codWikiData":"Q21213224"},{"numeActor":"Glenn Beck","codWikiData":"Q21213245"},{"numeActor":"Roy Stephens","codWikiData":"Q21213264"},{"numeActor":"Hal Galili","codWikiData":"Q21213287"},{"numeActor":"Paul Tamarin","codWikiData":"Q21213307"},{"numeActor":"Laurence Herder","codWikiData":"Q21213320"},{"numeActor":"John McCarthy","codWikiData":"Q21213333"}],"genuri":[{"denumireGen":"comedy","codWikiData":"Q157443"},{"denumireGen":"war","codWikiData":"Q369747"},{"denumireGen":"satirical","codWikiData":"Q3745430"},{"denumireGen":"black comedy","codWikiData":"Q5778924"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q11621","titlu":"E.T. the Extra-Terrestrial","descriere":"1982 film directed by Steven Spielberg","anAparitie":"1982","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/ET%20logo%203.svg","durata":"115","scorReview":"98%","director":null,"actori":[{"numeActor":"Debra Winger","codWikiData":"Q229009"},{"numeActor":"Erika Eleniak","codWikiData":"Q230390"},{"numeActor":"Dee Wallace","codWikiData":"Q258064"},{"numeActor":"Peter Coyote","codWikiData":"Q354873"},{"numeActor":"James Kahn","codWikiData":"Q374540"},{"numeActor":"Tamara De Treaux","codWikiData":"Q443775"},{"numeActor":"Anne Lockhart","codWikiData":"Q461742"},{"numeActor":"C. Thomas Howell","codWikiData":"Q464522"},{"numeActor":"Henry Thomas","codWikiData":"Q506198"},{"numeActor":"Drew Barrymore","codWikiData":"Q676094"},{"numeActor":"Robert MacNaughton","codWikiData":"Q1368550"},{"numeActor":"K. C. Martel","codWikiData":"Q1748409"},{"numeActor":"Sean Frye","codWikiData":"Q3953565"},{"numeActor":"Milt Kogan","codWikiData":"Q6860813"},{"numeActor":"Robert Barton","codWikiData":"Q7341915"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"science fiction","codWikiData":"Q471839"},{"denumireGen":"family","codWikiData":"Q1361932"},{"denumireGen":"children's","codWikiData":"Q2143665"}]},{"codWikiData":"Q500044","titlu":"The Lady Vanishes","descriere":"1938 film by Alfred Hitchcock","anAparitie":"1938","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/The-Lady-Vanishes-1938.jpg","durata":"96","scorReview":"98%","director":null,"actori":[{"numeActor":"Alfred Hitchcock","codWikiData":"Q7374"},{"numeActor":"Paul Lukas","codWikiData":"Q182057"},{"numeActor":"May Whitty","codWikiData":"Q240193"},{"numeActor":"Margaret Lockwood","codWikiData":"Q269202"},{"numeActor":"Michael Redgrave","codWikiData":"Q318263"},{"numeActor":"Googie Withers","codWikiData":"Q449070"},{"numeActor":"Basil Radford","codWikiData":"Q530875"},{"numeActor":"Naunton Wayne","codWikiData":"Q530921"},{"numeActor":"Cecil Parker","codWikiData":"Q1052329"},{"numeActor":"Catherine Lacey","codWikiData":"Q2941963"},{"numeActor":"Mary Clare","codWikiData":"Q3296162"},{"numeActor":"Linden Travers","codWikiData":"Q4355279"}],"genuri":[{"denumireGen":"crime","codWikiData":"Q959790"},{"denumireGen":"spy","codWikiData":"Q2297927"},{"denumireGen":"comedy thriller","codWikiData":"Q16950433"},{"denumireGen":"detective","codWikiData":"Q25533274"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q24901880","titlu":"The Big Sick","descriere":"2017 film by Michael Showalter","anAparitie":"2017","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Holly%20Hunter%2C%20Judd%20Apatow%2C%20Emily%20V.%20Gordon%20and%20Kumail%20Nanjiani%20%2831897405544%29.jpg","durata":"119","scorReview":"98%","director":null,"actori":[{"numeActor":"Holly Hunter","codWikiData":"Q105660"},{"numeActor":"Zoe Kazan","codWikiData":"Q218210"},{"numeActor":"Vincent Price","codWikiData":"Q219640"},{"numeActor":"Ray Romano","codWikiData":"Q220836"},{"numeActor":"Linda Emond","codWikiData":"Q276184"},{"numeActor":"Anupam Kher","codWikiData":"Q560163"},{"numeActor":"Bo Burnham","codWikiData":"Q887347"},{"numeActor":"Adeel Akhtar","codWikiData":"Q4681497"},{"numeActor":"Aidy Bryant","codWikiData":"Q4696803"},{"numeActor":"Kumail Nanjiani","codWikiData":"Q6443390"},{"numeActor":"Shenaz Treasurywala","codWikiData":"Q7494205"},{"numeActor":"Celeste Arias","codWikiData":"Q55454643"}],"genuri":[{"denumireGen":"romantic comedy","codWikiData":"Q860626"}]},{"codWikiData":"Q182692","titlu":"Apocalypse Now","descriere":"1979 American war film directed by Francis Ford Coppola","anAparitie":"1979","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Apocalypse%20Now%20Logo.png","durata":"153","scorReview":"98%","director":null,"actori":[{"numeActor":"Charles Robinson","codWikiData":"Q456258"},{"numeActor":"Nick Nicholson","codWikiData":"Q516789"},{"numeActor":"Frederic Forrest","codWikiData":"Q719266"},{"numeActor":"Bill Graham","codWikiData":"Q862152"},{"numeActor":"Christian Marquand","codWikiData":"Q1081030"},{"numeActor":"Evan A. Lottman","codWikiData":"Q1283819"},{"numeActor":"James Gaines","codWikiData":"Q1332579"},{"numeActor":"Sam Bottoms","codWikiData":"Q1374559"},{"numeActor":"Albert Hall","codWikiData":"Q1387383"},{"numeActor":"Tom Mason","codWikiData":"Q1962798"},{"numeActor":"Frank Villard","codWikiData":"Q3082309"},{"numeActor":"Joe Estevez","codWikiData":"Q3180060"},{"numeActor":"Pierre Segui","codWikiData":"Q3386965"},{"numeActor":"Jack Thibeau","codWikiData":"Q3805666"},{"numeActor":"Cynthia Wood","codWikiData":"Q4990707"},{"numeActor":"Marc Coppola","codWikiData":"Q6755482"},{"numeActor":"Jerry Ziesmer","codWikiData":"Q15452345"},{"numeActor":"Damien Leake","codWikiData":"Q22575685"},{"numeActor":"James Keane","codWikiData":"Q23072512"},{"numeActor":"Kerry Rossall","codWikiData":"Q28474288"},{"numeActor":"Marlon Brando","codWikiData":"Q34012"},{"numeActor":"Francis Ford Coppola","codWikiData":"Q56094"},{"numeActor":"Harrison Ford","codWikiData":"Q81328"},{"numeActor":"Dennis Hopper","codWikiData":"Q102711"},{"numeActor":"Charlie Sheen","codWikiData":"Q103939"},{"numeActor":"Scott Glenn","codWikiData":"Q114179"},{"numeActor":"Aurore Clément","codWikiData":"Q136221"},{"numeActor":"Gian-Carlo Coppola","codWikiData":"Q155299"},{"numeActor":"Robert Duvall","codWikiData":"Q171736"},{"numeActor":"Colleen Camp","codWikiData":"Q176945"},{"numeActor":"Martin Sheen","codWikiData":"Q184572"},{"numeActor":"Laurence Fishburne","codWikiData":"Q193048"},{"numeActor":"G. D. Spradlin","codWikiData":"Q195871"},{"numeActor":"Roman Coppola","codWikiData":"Q245808"},{"numeActor":"R. Lee Ermey","codWikiData":"Q353978"},{"numeActor":"Vittorio Storaro","codWikiData":"Q363413"}],"genuri":[{"denumireGen":"action","codWikiData":"Q188473"},{"denumireGen":"war","codWikiData":"Q369747"},{"denumireGen":"based on books","codWikiData":"Q52207310"},{"denumireGen":"drama","codWikiData":"Q130232"}]},{"codWikiData":"Q51520","titlu":"The Passion of Joan of Arc","descriere":"1928 film by Carl Theodor Dreyer","anAparitie":"1929","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Passion%20of%20Joan%20of%20Arc%20movie%20poster.jpg","durata":"110","scorReview":"98%","director":null,"actori":[{"numeActor":"Michel Simon","codWikiData":"Q124112"},{"numeActor":"Antonin Artaud","codWikiData":"Q187166"},{"numeActor":"Renée Jeanne Falconetti","codWikiData":"Q440600"},{"numeActor":"Alexandre Mihalesco","codWikiData":"Q2833873"},{"numeActor":"André Berley","codWikiData":"Q2847272"},{"numeActor":"Armand Lurville","codWikiData":"Q2861910"},{"numeActor":"Camille Bardou","codWikiData":"Q2934850"},{"numeActor":"Eugène Silvain","codWikiData":"Q3060175"},{"numeActor":"Jean d'Yd","codWikiData":"Q3175235"},{"numeActor":"Léon Larive","codWikiData":"Q3271129"},{"numeActor":"Maurice Schutz","codWikiData":"Q3301396"},{"numeActor":"Paul Fromet","codWikiData":"Q3371250"},{"numeActor":"Gilbert Dalleu","codWikiData":"Q15069896"},{"numeActor":"Louis Ravet","codWikiData":"Q15117539"},{"numeActor":"Raymond Narlay","codWikiData":"Q47843627"},{"numeActor":"Robert Le Flon","codWikiData":"Q95880501"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"},{"denumireGen":"silent","codWikiData":"Q226730"},{"denumireGen":"trial","codWikiData":"Q3072039"}]},{"codWikiData":"Q506418","titlu":"The Princess Bride","descriere":"1987 film directed by Rob Reiner","anAparitie":"1987","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Fantasy%20Worlds%20of%20Myth%20and%20Magic%2C%20EMP%2C%20Seattle%20-%20The%20Princess%20Bride%20%2815197708304%29.jpg","durata":"94","scorReview":"98%","director":null,"actori":[{"numeActor":"André the Giant","codWikiData":"Q44368"},{"numeActor":"Mark Knopfler","codWikiData":"Q185343"},{"numeActor":"Billy Crystal","codWikiData":"Q186485"},{"numeActor":"Carol Kane","codWikiData":"Q235302"},{"numeActor":"Mandy Patinkin","codWikiData":"Q267097"},{"numeActor":"Robin Wright","codWikiData":"Q272972"},{"numeActor":"Wallace Shawn","codWikiData":"Q311068"},{"numeActor":"Cary Elwes","codWikiData":"Q311093"},{"numeActor":"Christopher Guest","codWikiData":"Q336074"},{"numeActor":"Chris Sarandon","codWikiData":"Q363684"},{"numeActor":"Fred Savage","codWikiData":"Q447392"},{"numeActor":"Peter Falk","codWikiData":"Q484881"},{"numeActor":"Peter Cook","codWikiData":"Q525970"},{"numeActor":"Betsy Brantley","codWikiData":"Q540235"},{"numeActor":"Mel Smith","codWikiData":"Q939117"},{"numeActor":"Anne Dyson","codWikiData":"Q3617937"}],"genuri":[{"denumireGen":"fantasy","codWikiData":"Q157394"},{"denumireGen":"romantic comedy","codWikiData":"Q860626"},{"denumireGen":"pirate","codWikiData":"Q2096633"},{"denumireGen":"based on a novel","codWikiData":"Q52207399"}]},{"codWikiData":"Q152105","titlu":"Ikiru","descriere":"1952 film by Akira Kurosawa","anAparitie":"1956","urlImagine":"http://commons.wikimedia.org/wiki/Special:FilePath/Ikiru%20poster.jpg","durata":"143","scorReview":"98%","director":null,"actori":[{"numeActor":"Takashi Shimura","codWikiData":"Q40070"},{"numeActor":"Seiji Miyaguchi","codWikiData":"Q922612"},{"numeActor":"Minoru Chiaki","codWikiData":"Q975630"},{"numeActor":"Bokuzen Hidari","codWikiData":"Q1992367"},{"numeActor":"Kamatari Fujiwara","codWikiData":"Q3043193"},{"numeActor":"Kin Sugai","codWikiData":"Q3548276"},{"numeActor":"Nobuo Nakamura","codWikiData":"Q3551306"},{"numeActor":"Noriko Honma","codWikiData":"Q5508578"},{"numeActor":"Haruo Tanaka","codWikiData":"Q5675970"},{"numeActor":"Yūnosuke Itō","codWikiData":"Q11380490"},{"numeActor":"Shinichi Himori","codWikiData":"Q11505244"},{"numeActor":"Nobuo Kaneko","codWikiData":"Q11646709"},{"numeActor":"Makoto Kobori","codWikiData":"Q15069876"}],"genuri":[{"denumireGen":"drama","codWikiData":"Q130232"}]}];
          //  res = Utils.shuffleArray(res);

          this.listaFilmeWikiData = res || [];
          console.log("Rezultat cautare dupa filtre active = ", filtreActive, ", res=", res);
          this.listaRezultatComp.listaFilmeWikiData = this.listaFilmeWikiData;
          this.listaRezultatComp.getPagina();
        });
    }
  }

  adaugaIntrebareInUrlSiSchimbaRuta(){
    let urlCuFiltreActive = 'search';
    if (this.intrebare && this.intrebare.trim()) {
      urlCuFiltreActive += ('?' + QueryParamsEnum.QUESTION + '=' + this.intrebare.trim());
    }
    this.router.navigateByUrl(urlCuFiltreActive);
  }

  adaugaFiltreInUrlSiSchimbaRuta(){
    let urlCuFiltreActive = 'search';
    if (this.genuriSelectate && this.genuriSelectate.length > 0 && this.genuriSelectate[0]) {
      urlCuFiltreActive += ('?' + QueryParamsEnum.GENRES + '=' + this.genuriSelectate);
    }

    if (this.anSelectat) {
      urlCuFiltreActive += urlCuFiltreActive.includes('?') ?  '&' : '?';
      urlCuFiltreActive += (QueryParamsEnum.YEAR + '=' + this.anSelectat);
    }
    if (this.scorSelectat) {
      urlCuFiltreActive += urlCuFiltreActive.includes('?') ? '&' : '?';
      urlCuFiltreActive += (QueryParamsEnum.SCORE + '=' + this.scorSelectat);
    }
    if (this.sortareSelectata) {
      urlCuFiltreActive += urlCuFiltreActive.includes('?') ? '&' : '?';
      urlCuFiltreActive += (QueryParamsEnum.SORT + '=' + this.sortareSelectata);
    }

    this.router.navigateByUrl(urlCuFiltreActive);
  }

  chosenYearHandler(ev:any, input:any){
    let { _d } = ev;
    console.log("selected date=", _d);
    this.yearPicked = _d;
    this.anSelectat = (new Date(this.yearPicked)).getFullYear();
    // input._destroyPopup();
    this.picker.close();
  }

  clearYearPicked() {
    this.yearPicked = undefined;
    this.anSelectat = Number.parseInt('');
  }

//   speechToText(){
//     // Creates a client
//     const client = new speech.SpeechClient();
//
//     /**
//      * TODO(developer): Uncomment the following lines before running the sample.
//      */
// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
// const encoding = 'Encoding of the audio file, e.g. LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'BCP-47 language code, e.g. en-US';
//
//     const config = {
//       encoding: encoding,
//       sampleRateHertz: sampleRateHertz,
//       languageCode: languageCode,
//     };
//
//     /**
//      * Note that transcription is limited to 60 seconds audio.
//      * Use a GCS file for audio longer than 1 minute.
//      */
//     const audio = {
//       content: fs.readFileSync(filename).toString('base64'),
//     };
//
//     const request = {
//       config: config,
//       audio: audio,
//     };
//
// // Detects speech in the audio file. This creates a recognition job that you
// // can wait for now, or get its result later.
//     const [operation] = await client.longRunningRecognize(request);
//
// // Get a Promise representation of the final result of the job
//     const [response] = await operation.promise();
//     const transcription = response.results
//       .map(result => result.alternatives[0].transcript)
//       .join('\n');
//     console.log(`Transcription: ${transcription}`);
//   }
}
