export class Utils{

  public static getTooltipButonFavorite (film: any, listaFilmeFavorite: any[]): string {
    return Utils.filmulEsteFavorit(film, listaFilmeFavorite) ? 'Elimina de la favorite' : 'Adauga la favorite';
  }

  public static filmulEsteFavorit (codFilm: any, listaCoduriFilmeFavorite: any[]): boolean {

    return listaCoduriFilmeFavorite.includes(codFilm);
  }
}
