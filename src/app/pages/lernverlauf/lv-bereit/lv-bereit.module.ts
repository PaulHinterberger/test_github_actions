import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvBereitPage } from './lv-bereit.page';
import {CommonComponentsModule} from "../../../common-components/common-components.module";

const routes: Routes = [
  {
    path: '',
    component: LvBereitPage
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
  declarations: [LvBereitPage]
})
export class LvBereitPageModule {}
