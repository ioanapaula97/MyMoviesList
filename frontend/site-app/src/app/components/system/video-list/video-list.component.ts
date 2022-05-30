import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.less']
})
export class VideoListComponent implements OnInit {

  moviesListMock = [
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Nasul', scorReview: '7.8/10', genuri: ["drama", "crima"], durata:"136 minute", anAparitie: 1972, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/57/1356657/nasul-vol-1_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Cavalerul negru', scorReview: '8.8/10', genuri: ["drama", "actiune", "crima", "thriller"], durata:"136 minute", anAparitie: 2008, urlImagine: 'https://upload.wikimedia.org/wikipedia/ro/d/d1/The_Dark_Knight.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Lista lui Schindler', scorReview: '9.8/10', genuri: ["istoric"], durata:"136 minute", anAparitie: 1993, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/58/2005758/lista-lui-schindler_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Forest Gump', scorReview: '7.9/10', genuri: ["comedie", "drama", "romantic"], durata:"", anAparitie: 1994, urlImagine: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Nasul', scorReview: '8.5/10', genuri: ["drama", "crima"], durata:"136 minute", anAparitie: 1972, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/57/1356657/nasul-vol-1_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Cavalerul negru', scorReview: '7.5/10', genuri: ["drama", "actiune", "crima", "thriller"], durata:"136 minute", anAparitie: 2008, urlImagine: 'https://upload.wikimedia.org/wikipedia/ro/d/d1/The_Dark_Knight.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Lista lui Schindler', scorReview: '9.8/10', genuri: ["istoric"], durata:"136 minute", anAparitie: 1993, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/58/2005758/lista-lui-schindler_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', odWikiData: 'Q123423', titlu: 'Forest Gump', scorReview: '7.3/10', genuri: ["comedie", "drama", "romantic"], durata:"136 minute", anAparitie: 1994, urlImagine: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Nasul', scorReview: '7.8/10', genuri: ["drama", "crima"], durata:"136 minute", anAparitie: 1972, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/57/1356657/nasul-vol-1_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Cavalerul negru', scorReview: '8.8/10', genuri: ["drama", "actiune", "crima", "thriller"], durata:"136 minute", anAparitie: 2008, urlImagine: 'https://upload.wikimedia.org/wikipedia/ro/d/d1/The_Dark_Knight.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Lista lui Schindler', scorReview: '9.8/10', genuri: ["istoric"], durata:"136 minute", anAparitie: 1993, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/58/2005758/lista-lui-schindler_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Forest Gump', scorReview: '7.9/10', genuri: ["comedie", "drama", "romantic"], durata:"", anAparitie: 1994, urlImagine: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Nasul', scorReview: '8.5/10', genuri: ["drama", "crima"], durata:"136 minute", anAparitie: 1972, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/57/1356657/nasul-vol-1_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Cavalerul negru', scorReview: '7.5/10', genuri: ["drama", "actiune", "crima", "thriller"], durata:"136 minute", anAparitie: 2008, urlImagine: 'https://upload.wikimedia.org/wikipedia/ro/d/d1/The_Dark_Knight.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Lista lui Schindler', scorReview: '9.8/10', genuri: ["istoric"], durata:"136 minute", anAparitie: 1993, urlImagine: 'https://mcdn.elefant.ro/mnresize/1500/1500/images/58/2005758/lista-lui-schindler_1_fullsize.jpg'},
    {descriere: 'După dispariția unui băiat, un orășel descoperă un mister care implică experimente secrete, forțe supranaturale cutremurătoare și o fetiță foarte ciudată.', codWikiData: 'Q123423', titlu: 'Forest Gump', scorReview: '7.3/10', genuri: ["comedie", "drama", "romantic"], durata:"136 minute", anAparitie: 1994, urlImagine: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg'}
  ];

  listaFilme: any[] = [];

  @ViewChild(MatPaginator, {static:true}) paginator: MatPaginator;
  totalElements: number;


  constructor(private filmService: FilmService) {
  }

  ngOnInit(): void {
    this.paginator.initialized.subscribe(() => this.getPagina());


  }

  getPagina() {
    console.log('GET page ', this.paginator.pageSize, this.paginator.pageIndex);
    let startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    let endIndex = startIndex + this.paginator.pageSize;
    this.listaFilme =  this.moviesListMock.slice(startIndex, endIndex);
    this.totalElements = this.moviesListMock.length;
  }

  setFilmSelectat(film: any) {
    localStorage.setItem('filmSelectat', JSON.stringify(film));
  }

}
