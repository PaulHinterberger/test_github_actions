import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';
import {MaterialModule} from '../../../app.material/app.material.module';
import {SchnappReimenPage} from './schnapp-reimen.page';
import {HttpClientModule} from '@angular/common/http';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';


const routes: Routes = [
    {
        path: '',
        component: SchnappReimenPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
        HttpClientModule,
        CommonComponentsModule,        
        RouterModule.forChild(routes)
    ],
    declarations: [SchnappReimenPage],
    exports: [
        SchnappReimenPage
    ]
})
export class SchnappReimenPageModule {
}
