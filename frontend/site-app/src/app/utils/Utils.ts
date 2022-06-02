export class Utils{

  public static getTooltipButonFavorite (codFilm: any, listaCoduriFilmeFavorite: any[]): string {
    return Utils.filmulEsteFavorit(codFilm, listaCoduriFilmeFavorite) ? 'Elimina de la favorite' : 'Adauga la favorite';
  }

  public static filmulEsteFavorit (codFilm: any, listaCoduriFilmeFavorite: any[]): boolean {

    return listaCoduriFilmeFavorite.includes(codFilm);
  }
}
