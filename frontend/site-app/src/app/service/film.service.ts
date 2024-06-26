import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {TipSortareEnum} from "../model/TipSortareEnum";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FilmService {
  constructor(private http: HttpClient) {}

  public getRaspunsIntrebare(intrebare: string): Observable<any> {
    return this.http.get(`/api/v1/film/model-qa-raspuns-intrebare${intrebare}`);
  }

  public getFilmeDupaFiltre(filtreActive: string): Observable<any> {
    return this.http.get(`/api/v1/film/wikidata/filtre${filtreActive}`);
  }

  public getFilmeDupaAnAparitie(anAparitie?: number, tipSortare?: TipSortareEnum): Observable<any> {
    return this.http.get(`/api/v1/film/wikidata/an-aparitie?anAparitie=${anAparitie}&tipSortare=${tipSortare}`);
  }

  public getFilmeDupaVarstaPermisa(varsta?: string, tipSortare?: TipSortareEnum): Observable<any> {
    return this.http.get(`/api/v1/film/wikidata/varsta?varsta=${varsta}&tipSortare=${tipSortare}`);
  }

  public getFilmeRecomandate(userId: number): Observable<any> {
    console.log( '***FILM SERVICE*** getFilmeRecomandate');
    // return of([{},{}]);
    return this.http.get(`/api/v1/film/model-recomandari-filme?user_id=${userId}`);
  }

  public getFilmeDupaTopScor(): Observable<any> {
    console.log( '***FILM SERVICE*** getFilmeDupaTopScor');
    // return of([{},{}]);
    return this.http.get('/api/v1/film/wikidata/top-scor');
  }

  public getFilmeCeleMaiNoi(): Observable<any> {
    console.log( '***FILM SERVICE*** getFilmeCeleMaiNoi');
    // return of([{},{}]);
    return this.http.get('/api/v1/film/wikidata/cele-mai-noi');
  }

  public getFilmeWikiDataDupaCoduri(coduriWikiData: number[]): Observable<any> {
    return this.http.get(`/api/v1/film/wikidata?coduriWikiData=${coduriWikiData}`);
  }

  public getFilmeleUtilizatorului(userId: number): Observable<any> {
    return this.http.get(`/api/v1/film/toate-ale-utilizatorului/${userId}`);
  }

  public adaugaFilmLaFavorite(userId: number, codFilm: string): Observable<any> {
    let url = `/api/v1/film/adauga-favorit/${userId}`;
    if (codFilm) url += `/${codFilm}`
    return this.http.post(url, {});
  }

  public eliminaFilmDeLaFavorite(userId: number, codFilm: string): Observable<any> {
    let url = `/api/v1/film/elimina-favorit/${userId}`;
    if (codFilm) url += `/${codFilm}`
    return this.http.post(url, {});
  }

  public acordaNotaFilm(userId: number, codFilm: string, nota: number): Observable<any> {
    let url = `/api/v1/film/acorda-nota?userId=${userId}`;
    if (codFilm) url += `&codFilmWikiData=${codFilm}`;
    if (nota) url += `&nota=${nota}`;

    return this.http.post(url, {});
  }

  public schimbaStatusFilm(userId: number, codFilm: string, statusFilm: string): Observable<any> {
    let url = `/api/v1/film/schimba-status?userId=${userId}`;
    if (codFilm) url += `&codFilmWikiData=${codFilm}`;
    if (statusFilm) url += `&statusFilm=${statusFilm}`;

    return this.http.post(url, {});
  }
}
