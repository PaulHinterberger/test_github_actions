import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchnappBereitPage } from './schnapp-bereit.page';

describe('SchnappBereitPage', () => {
  let component: SchnappBereitPage;
  let fixture: ComponentFixture<SchnappBereitPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchnappBereitPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchnappBereitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
