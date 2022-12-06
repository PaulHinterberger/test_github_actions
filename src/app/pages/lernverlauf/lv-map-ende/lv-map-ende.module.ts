import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvMapEndePage } from './lv-map-ende.page';

const routes: Routes = [
  {
    path: '',
    component: LvMapEndePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LvMapEndePage]
})
export class LvMapEndePageModule {}
