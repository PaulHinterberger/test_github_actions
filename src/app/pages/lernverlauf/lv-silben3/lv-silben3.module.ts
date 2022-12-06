import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {LvSilben3Page} from './lv-silben3.page';
import {MaterialModule} from 'src/app/app.material/app.material.module';
import {MatIconModule} from '@angular/material/icon';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: LvSilben3Page
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
    declarations: [LvSilben3Page]
})
export class LvSilben3PageModule {
}
