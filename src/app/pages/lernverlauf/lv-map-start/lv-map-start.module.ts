import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvMapStartPage } from './lv-map-start.page';

const routes: Routes = [
  {
    path: '',
    component: LvMapStartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LvMapStartPage]
})
export class LvMapStartPageModule {}
