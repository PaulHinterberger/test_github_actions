
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {MaterialModule} from '../../../app.material/app.material.module';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {SchnappNachsprechenVorwaertsPage} from './schnapp-nachsprechen-vorwaerts.page';

import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappNachsprechenVorwaertsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HttpClientModule,
        MaterialModule,
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [SchnappNachsprechenVorwaertsPage],
    exports: [
        SchnappNachsprechenVorwaertsPage
    ]
})
export class SchnappNachsprechenVorwaertsPageModule {
}
