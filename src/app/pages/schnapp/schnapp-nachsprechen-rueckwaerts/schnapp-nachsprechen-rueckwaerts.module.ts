
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {MaterialModule} from '../../../app.material/app.material.module';
import {HttpClientModule} from '@angular/common/http';
import {SchnappNachsprechenRueckwaertsPage} from './schnapp-nachsprechen-rueckwaerts.page';

import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappNachsprechenRueckwaertsPage
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
    declarations: [SchnappNachsprechenRueckwaertsPage],
    exports: [
        SchnappNachsprechenRueckwaertsPage
    ]
})
export class SchnappNachsprechenRueckwaertsPagePageModule {
}
