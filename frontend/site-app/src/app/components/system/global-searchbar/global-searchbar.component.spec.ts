import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSearchbarComponent } from './global-searchbar.component';

describe('GlobalSearchbarComponent', () => {
  let component: GlobalSearchbarComponent;
  let fixture: ComponentFixture<GlobalSearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlobalSearchbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
