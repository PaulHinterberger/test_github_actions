
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../../app.material/app.material.module';

import {IonicModule} from '@ionic/angular';

import {SchnappNonverbaleIntelligenzBPage} from './schnapp-nonverbale-intelligenz-b.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappNonverbaleIntelligenzBPage
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
    declarations: [SchnappNonverbaleIntelligenzBPage],
    exports: [
        SchnappNonverbaleIntelligenzBPage
    ]
})
export class SchnappNonverbaleIntelligenzBPageModule {
}
