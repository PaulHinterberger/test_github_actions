import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ExerciseWordPage } from './exercise-word.page';
import { MaterialModule } from 'src/app/app.material/app.material.module';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
//import { NextPageButtonModule } from 'src/app/components/next-page-button/next-page-button.module';

const routes: Routes = [
  {
    path: '',
    component: ExerciseWordPage
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
  declarations: [ExerciseWordPage]
})
export class ExerciseWordPageModule {}
