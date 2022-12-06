import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvSilbenPage } from './lv-silben.page';
import {MaterialModule} from '../../../app.material/app.material.module';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';


const routes: Routes = [
  {
    path: '',
    component: LvSilbenPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        IonicModule,
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
  declarations: [LvSilbenPage]
})
export class LvSilbenPageModule {}
