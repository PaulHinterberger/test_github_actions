import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GralevFirstTextPage } from './gralev-first-text.page';

describe('GralevFirstTextPage', () => {
  let component: GralevFirstTextPage;
  let fixture: ComponentFixture<GralevFirstTextPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GralevFirstTextPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GralevFirstTextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
