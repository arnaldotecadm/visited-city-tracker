import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaDoBrasilComponent } from './mapa-do-brasil.component';

describe('MapaDoBrasilComponent', () => {
  let component: MapaDoBrasilComponent;
  let fixture: ComponentFixture<MapaDoBrasilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaDoBrasilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaDoBrasilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
