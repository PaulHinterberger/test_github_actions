import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';

import { IonicModule } from '@ionic/angular';

import { ExerciseSentencePage } from './exercise-sentence.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
//import { NextPageButtonModule } from 'src/app/components/next-page-button/next-page-button.module';

const routes: Routes = [
  {
    path: '',
    component: ExerciseSentencePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    IonicModule,
    //NextPageButtonModule,
    CommonComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ExerciseSentencePage]
})
export class ExerciseSentencePageModule {}
