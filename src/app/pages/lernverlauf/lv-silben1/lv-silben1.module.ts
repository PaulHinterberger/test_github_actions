import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LvSilben1Page} from './lv-silben1.page';
import {MaterialModule} from 'src/app/app.material/app.material.module';
import {MatIconModule} from '@angular/material/icon';

import {CommonComponentsModule} from '../../../common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: LvSilben1Page
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
        IonicModule,
        RouterModule.forChild(routes),
        MatIconModule,
        CommonComponentsModule
    ],
    declarations: [LvSilben1Page]
})
export class LvSilben1PageModule {
}
