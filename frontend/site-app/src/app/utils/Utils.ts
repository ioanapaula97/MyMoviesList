export class Utils{

  public static getTooltipButonFavorite (codFilm: any, listaCoduriFilmeFavorite: any[]| undefined): string {
    return Utils.filmulEsteFavorit(codFilm, listaCoduriFilmeFavorite) ? 'Elimina de la favorite' : 'Adauga la favorite';
  }

  public static filmulEsteFavorit (codFilm: any, listaCoduriFilmeFavorite: any[]| undefined): boolean {
    if(listaCoduriFilmeFavorite) return listaCoduriFilmeFavorite.includes(codFilm);
    return false;
  }

  public static getCoduriFilmeFavorite(listaFilmeUtilizator: any[]): string[] {
    let coduriFavorite: string[] = [];

    if (listaFilmeUtilizator && listaFilmeUtilizator.length > 0) {
      coduriFavorite = listaFilmeUtilizator.filter(f => f.esteFavorit === true).map(f => f.codWikiData) || [];
    }

    return coduriFavorite;
  }

  public static setFilmWikiDataSelectatInLocalStorage(film: any) {
    localStorage.setItem('filmSelectatWikiData', JSON.stringify(film));
  }

  public static getFilmWikiDataSelectatDinLocalStorage(): any{
    let filmStr: string = localStorage.getItem('filmSelectatWikiData') || '{}';
    return JSON.parse(filmStr) as Object;
  }

  public static shuffleArray (array:any[]) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
}
