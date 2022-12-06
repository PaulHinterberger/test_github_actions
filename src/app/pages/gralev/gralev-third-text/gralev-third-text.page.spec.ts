import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GralevThirdTextPage } from './gralev-third-text.page';

describe('GralevThirdTextPage', () => {
  let component: GralevThirdTextPage;
  let fixture: ComponentFixture<GralevThirdTextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GralevThirdTextPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GralevThirdTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
