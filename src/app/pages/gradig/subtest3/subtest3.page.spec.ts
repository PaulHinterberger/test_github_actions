import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtest3Page } from './subtest3.page';

describe('Subtest3Page', () => {
  let component: Subtest3Page;
  let fixture: ComponentFixture<Subtest3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Subtest3Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Subtest3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
