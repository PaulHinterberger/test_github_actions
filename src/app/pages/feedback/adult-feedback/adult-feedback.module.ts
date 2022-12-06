import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdultFeedbackPage } from './adult-feedback.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
import { MaterialModule } from 'src/app/app.material/app.material.module';

const routes: Routes = [
  {
    path: '',
    component: AdultFeedbackPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    IonicModule,
    CommonComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdultFeedbackPage]
})
export class AdultFeedbackPageModule {}
