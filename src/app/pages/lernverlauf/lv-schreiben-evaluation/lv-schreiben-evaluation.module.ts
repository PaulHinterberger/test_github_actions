import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';

import { IonicModule } from '@ionic/angular';

import { LvSchreibenEvaluationPage} from './lv-schreiben-evaluation.page';

const routes: Routes = [
  {
    path: '',
    component: LvSchreibenEvaluationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LvSchreibenEvaluationPage]
})
export class LvSchreibenEvaluationPageModule {}
