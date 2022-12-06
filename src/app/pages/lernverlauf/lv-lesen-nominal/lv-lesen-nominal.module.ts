import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvLesenNominalPage } from './lv-lesen-nominal.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
import { MaterialModule } from 'src/app/app.material/app.material.module';

const routes: Routes = [
  {
    path: '',
    component: LvLesenNominalPage
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
  declarations: [LvLesenNominalPage]
})
export class LvLesenNominalPageModule {}
