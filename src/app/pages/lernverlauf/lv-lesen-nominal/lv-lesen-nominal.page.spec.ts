import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LvLesenNominalPage } from './lv-lesen-nominal.page';

describe('LvLesenNominalPage', () => {
  let component: LvLesenNominalPage;
  let fixture: ComponentFixture<LvLesenNominalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LvLesenNominalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LvLesenNominalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
