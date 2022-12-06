import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SchnappBereitPage } from './schnapp-bereit.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: SchnappBereitPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CommonComponentsModule
  ],
  declarations: [SchnappBereitPage]
})
export class SchnappBereitPageModule {}
