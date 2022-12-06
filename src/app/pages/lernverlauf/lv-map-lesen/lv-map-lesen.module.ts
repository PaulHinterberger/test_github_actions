import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvMapLesenPage } from './lv-map-lesen.page';

const routes: Routes = [
  {
    path: '',
    component: LvMapLesenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LvMapLesenPage]
})
export class LvMapLesenPageModule {}
