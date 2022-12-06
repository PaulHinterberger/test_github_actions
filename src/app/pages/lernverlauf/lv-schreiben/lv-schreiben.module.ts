import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';

import { IonicModule } from '@ionic/angular';

import { LvSchreibenPage } from './lv-schreiben.page';

const routes: Routes = [
  {
    path: '',
    component: LvSchreibenPage
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
  declarations: [LvSchreibenPage]
})
export class LvSchreibenPageModule {}
