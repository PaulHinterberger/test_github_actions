import {MaterialModule} from '../../../app.material/app.material.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {SchnappPassiverWortschatzPage} from './schnapp-passiver-wortschatz.page';
import { SummaryComponent } from './summary/summary.component';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';


const routes: Routes = [
    {
        path: '',
        component: SchnappPassiverWortschatzPage
    },
    {
        path: 'summary',
        component: SummaryComponent
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        CommonComponentsModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SchnappPassiverWortschatzPage, 
        SummaryComponent
    ],
    exports: [
        SchnappPassiverWortschatzPage,
        SummaryComponent
    ]
})
export class SchnappPassiverWortschatzPageModule {
}
