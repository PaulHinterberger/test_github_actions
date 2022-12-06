import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExerciseFinishedPage } from './exercise-finished.page';
import {MatCardModule, MatGridListModule} from '@angular/material';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: ExerciseFinishedPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        MatGridListModule,
        MatCardModule,
        CommonComponentsModule
    ],
  declarations: [ExerciseFinishedPage]
})
export class ExerciseFinishedPageModule {}
