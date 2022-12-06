import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvMapSchreibenPage } from './lv-map-schreiben.page';

const routes: Routes = [
  {
    path: '',
    component: LvMapSchreibenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LvMapSchreibenPage]
})
export class LvMapSchreibenPageModule {}
