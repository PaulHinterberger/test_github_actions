
import {MaterialModule} from '../../../app.material/app.material.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SchnappWortmerkenPage} from './schnapp-wortmerken.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappWortmerkenPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        
        RouterModule.forChild(routes),
        CommonComponentsModule
    ],
    declarations: [SchnappWortmerkenPage],
    exports: [
        SchnappWortmerkenPage
    ]
})
export class SchnappWortmerkenPageModule {
}
