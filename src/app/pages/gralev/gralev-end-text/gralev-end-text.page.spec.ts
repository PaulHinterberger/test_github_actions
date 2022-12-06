import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GralevEndTextPage } from './gralev-end-text.page';

describe('GralevEndTextPage', () => {
  let component: GralevEndTextPage;
  let fixture: ComponentFixture<GralevEndTextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GralevEndTextPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GralevEndTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
