import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';

import { IonicModule } from '@ionic/angular';

import { LvLesenPage } from './lv-lesen.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: LvLesenPage
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
  declarations: [LvLesenPage]
})
export class LvLesenPageModule {}
