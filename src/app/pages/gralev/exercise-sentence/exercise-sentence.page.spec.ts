import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseSentencePage } from './exercise-sentence.page';

describe('ExerciseSentencePage', () => {
  let component: ExerciseSentencePage;
  let fixture: ComponentFixture<ExerciseSentencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseSentencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseSentencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
