import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchnappNonverbaleIntelligenzBetweenPage } from './schnapp-nonverbale-intelligenz-between.page';

const routes: Routes = [
  {
    path: '',
    component: SchnappNonverbaleIntelligenzBetweenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SchnappNonverbaleIntelligenzBetweenPage]
})
export class SchnappNonverbaleIntelligenzBetweenPageModule {}
