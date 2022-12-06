import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtest2Page } from './subtest2.page';

describe('Subtest2Page', () => {
  let component: Subtest2Page;
  let fixture: ComponentFixture<Subtest2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Subtest2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Subtest2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
