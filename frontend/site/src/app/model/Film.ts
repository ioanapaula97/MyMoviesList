import {FilmWIkiData} from "./FilmWIkiData";


export class Film {
  private user_id: number;
  private id: number;
  private created: Date;
  private version: Date;
  private codWikiData: string;
  private esteFavorit: boolean;
  private statusFilm: string;
  private notaFilm: number;
  private detaliiFilm: FilmWIkiData;

  constructor(user_id: number, id: number, created: Date, version: Date, codWikiData: string, esteFavorit: boolean, statusFilm: string, notaFilm: number, detaliiFilm: FilmWIkiData) {
    this.user_id = user_id;
    this.id = id;
    this.created = created;
    this.version = version;
    this.codWikiData = codWikiData;
    this.esteFavorit = esteFavorit;
    this.statusFilm = statusFilm;
    this.notaFilm = notaFilm;
    this.detaliiFilm = detaliiFilm;
  }
}
