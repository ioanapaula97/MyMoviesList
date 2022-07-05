import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FilmService} from "../../../service/film.service";
import {UserService} from "../../../service/user.service";
import {StatusFilmEnum} from "../../../model/StatusFilmEnum";

@Component({
  selector: 'app-status-dropdown',
  templateUrl: './status-dropdown.component.html',
  styleUrls: ['./status-dropdown.component.less']
})
export class StatusDropdownComponent implements OnInit {

  @Input() filmUtilizator: any;
  @Output() statusFilmChange = new EventEmitter<any | undefined>();

  optiuniFilmStatus: any[] = [
    {view: '', value: null},
    {view: 'COMPLETED', value: StatusFilmEnum.COMPLETED},
    {view: 'PLAN TO WATCH', value: StatusFilmEnum.PLAN_TO_WATCH},
    {view: 'WATCHING', value: StatusFilmEnum.WATCHING}
  ];

  constructor(private filmService: FilmService,
              private userService: UserService) {
  }

  ngOnInit(): void {
  }


  onStatusChange($event: any) {
    console.log("onStatusChange $event=", $event);
    console.log("onStatusChange this.filmUtilizator=", this.filmUtilizator);
    let noulStatus = $event.value;
    this.filmService.schimbaStatusFilm(this.userService.getIdUtilizatorCurent(), this.filmUtilizator.codWikiData, noulStatus)
      .subscribe(res => this.statusFilmChange.emit({statusFilm: noulStatus}));
  }
}
