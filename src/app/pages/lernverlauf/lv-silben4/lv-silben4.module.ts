import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvSilben4Page } from './lv-silben4.page';
import {MaterialModule} from 'src/app/app.material/app.material.module'


const routes: Routes = [
  {
    path: '',
    component: LvSilben4Page
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LvSilben4Page]
})
export class LvSilben4PageModule {}
