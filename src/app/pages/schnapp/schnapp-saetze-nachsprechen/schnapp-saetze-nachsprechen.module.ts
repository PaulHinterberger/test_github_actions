
import {MaterialModule} from '../../../app.material/app.material.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SchnappSaetzeNachsprechenPage} from './schnapp-saetze-nachsprechen.page';
import {CommonComponentsModule} from '../../../common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappSaetzeNachsprechenPage
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
    declarations: [SchnappSaetzeNachsprechenPage],
    exports: [
        SchnappSaetzeNachsprechenPage
    ]
})
export class SchnappSaetzeNachsprechenPageModule {
}
