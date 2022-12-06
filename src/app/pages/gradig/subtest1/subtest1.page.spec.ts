import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtest1Page } from './subtest1.page';

describe('Subtest1Page', () => {
  let component: Subtest1Page;
  let fixture: ComponentFixture<Subtest1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Subtest1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Subtest1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
