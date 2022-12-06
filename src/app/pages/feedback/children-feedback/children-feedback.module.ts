import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChildrenFeedbackPage } from './children-feedback.page';
import { MaterialModule } from 'src/app/app.material/app.material.module';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: ChildrenFeedbackPage
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
  declarations: [ChildrenFeedbackPage]
})
export class ChildrenFeedbackPageModule {}
