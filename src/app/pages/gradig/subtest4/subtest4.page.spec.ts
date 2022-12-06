import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtest4Page } from './subtest4.page';

describe('Subtest4Page', () => {
  let component: Subtest4Page;
  let fixture: ComponentFixture<Subtest4Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Subtest4Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Subtest4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
