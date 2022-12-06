import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LvSilben2Page } from './lv-silben2.page';
import { MaterialModule } from 'src/app/app.material/app.material.module';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: LvSilben2Page
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
  declarations: [LvSilben2Page]
})
export class LvSilben2PageModule {}
