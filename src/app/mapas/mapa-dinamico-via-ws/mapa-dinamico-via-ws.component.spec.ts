import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaDinamicoViaWsComponent } from './mapa-dinamico-via-ws.component';

describe('MapaDinamicoViaWsComponent', () => {
  let component: MapaDinamicoViaWsComponent;
  let fixture: ComponentFixture<MapaDinamicoViaWsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaDinamicoViaWsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaDinamicoViaWsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
