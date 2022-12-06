
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';

import {IonicModule} from '@ionic/angular';

import {SchnappNonverbaleIntelligenzAPage} from './schnapp-nonverbale-intelligenz-a.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappNonverbaleIntelligenzAPage
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
    declarations: [SchnappNonverbaleIntelligenzAPage],
    exports: [
        SchnappNonverbaleIntelligenzAPage
    ]
})
export class SchnappNonverbaleIntelligenzAPageModule {
}
