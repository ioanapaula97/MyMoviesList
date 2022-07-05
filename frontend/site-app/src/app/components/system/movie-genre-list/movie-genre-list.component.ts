import {Component, Input, OnInit} from '@angular/core';
import {Utils} from "../../../utils/Utils";
import {QueryParamsEnum} from "../../../model/QueryParamsEnum";
import {Router} from "@angular/router";

@Component({
  selector: 'app-movie-genre-list',
  templateUrl: './movie-genre-list.component.html',
  styleUrls: ['./movie-genre-list.component.less']
})
export class MovieGenreListComponent implements OnInit {

  @Input() film: any | undefined;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  cautaFilmeDupaGenulSelectat(gen:any){
    Utils.setGenSelectatInLocalStorage(gen);
    this.adaugaGenInUrlSiSchimbaRuta(gen.codWikiData);

  }

  adaugaGenInUrlSiSchimbaRuta(codGen: string){
    let urlCuFiltreActive = 'search';
    if (codGen && codGen.trim()) {
      urlCuFiltreActive += ('?' + QueryParamsEnum.GEN + '=' + codGen.trim());
    }
    this.router.navigateByUrl(urlCuFiltreActive);
  }
}
