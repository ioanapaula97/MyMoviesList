import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieGenreListComponent } from './movie-genre-list.component';

describe('MovieGenreListComponent', () => {
  let component: MovieGenreListComponent;
  let fixture: ComponentFixture<MovieGenreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MovieGenreListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieGenreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
