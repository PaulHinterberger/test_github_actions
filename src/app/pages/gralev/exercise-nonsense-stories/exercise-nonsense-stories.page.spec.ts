import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseNonsenseStoriesPage } from './exercise-nonsense-stories.page';

describe('ExerciseNonsenseStoriesPage', () => {
  let component: ExerciseNonsenseStoriesPage;
  let fixture: ComponentFixture<ExerciseNonsenseStoriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciseNonsenseStoriesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciseNonsenseStoriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
