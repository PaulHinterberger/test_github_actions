import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';
import {IonicModule} from '@ionic/angular';

import {SchnappAnlauteErkennenPage} from './schnapp-anlaute-erkennen.page';

import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappAnlauteErkennenPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [SchnappAnlauteErkennenPage],
    exports: [
        SchnappAnlauteErkennenPage
    ]
})
export class SchnappAnlauteErkennenPageModule {
}
