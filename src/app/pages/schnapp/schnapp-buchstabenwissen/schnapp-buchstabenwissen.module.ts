
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {MaterialModule} from '../../../app.material/app.material.module';

import {SchnappBuchstabenwissenPage} from './schnapp-buchstabenwissen.page';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

const routes: Routes = [
    {
        path: '',
        component: SchnappBuchstabenwissenPage
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
    declarations: [SchnappBuchstabenwissenPage],
    exports: [
        SchnappBuchstabenwissenPage
    ]
})
export class SchnappBuchstabenwissenPageModule {
}
