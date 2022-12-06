import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GralevSecondTextPage } from './gralev-second-text.page';

describe('GralevSecondTextPage', () => {
  let component: GralevSecondTextPage;
  let fixture: ComponentFixture<GralevSecondTextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GralevSecondTextPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GralevSecondTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
