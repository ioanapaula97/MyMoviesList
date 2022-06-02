import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TipSortareEnum} from "../model/TipSortareEnum";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilmService {


  constructor(private http: HttpClient) { }

  public getFilmeDupaGenuri(genuri?: string[], tipSortare?: TipSortareEnum): Observable<any>{
    return this.http.get(`/api/v1/film/wikidata/genuri?genuri=${genuri}&tipSortare=${tipSortare}`);
  }

  public getFilmeDupaAnAparitie(anAparitie?: number, tipSortare?: TipSortareEnum): Observable<any>{
    return this.http.get(`/api/v1/film/wikidata/an-aparitie?anAparitie=${anAparitie}&tipSortare=${tipSortare}`);
  }

  public getFilmeDupaVarstaPermisa(varsta?: string, tipSortare?: TipSortareEnum): Observable<any>{
    return this.http.get(`/api/v1/film/wikidata/varsta?varsta=${varsta}&tipSortare=${tipSortare}`);
  }

  public getFilmeDupaTopScor(): Observable<any>{
    return this.http.get('/api/v1/film/wikidata/top-scor');
  }

  public getFilmeleUtilizatorului(userId:number): Observable<any>{
    return this.http.get(`/api/v1/film/toate-ale-utilizatorului/${userId}`);
  }

  public adaugaFilmLaFavorite(userId:number, codFilm: string): Observable<any>{
    return this.http.post(`/api/v1/film/adauga-favorit/${userId}/${codFilm}`, {});
  }

  public eliminaFilmDeLaFavorite(userId:number, codFilm: string): Observable<any>{
    return this.http.post(`/api/v1/film/elimina-favorit/${userId}/${codFilm}`, {});
  }

  public acordaNotaFilm(userId:number, codFilm: string, nota: number): Observable<any>{
    return this.http.post(`/api/v1/film/acorda-nota/${userId}/${codFilm}/${nota}`, {});
  }

  public schimbaStatusFilm(userId:number, codFilm: string, statusFilm:string): Observable<any>{
    return this.http.post(`/api/v1/film/schimba-status/${userId}/${codFilm}/${statusFilm}`, {});
  }
}