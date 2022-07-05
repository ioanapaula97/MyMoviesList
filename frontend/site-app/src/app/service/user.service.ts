import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Utils} from "../utils/Utils";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getIdUtilizatorCurent():number {
    return Utils.getIdUserCurentDinLocalStorage();
  }

  public getUserDupaAdresaEmailSauSalveazaNouUser(adresaEmail: string): Observable<any> {
    return this.http.get(`/api/v1/user/${adresaEmail}`);
  }


}
