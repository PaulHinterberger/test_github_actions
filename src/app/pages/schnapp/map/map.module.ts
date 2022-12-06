import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {MaterialModule} from '../../../app.material/app.material.module';
import {MapPage} from './map.page';
import {IonicImageLoader} from 'ionic-image-loader';
import {DragDropModule} from '@angular/cdk/drag-drop';

const routes: Routes = [
    {
        path: '',
        component: MapPage
    }
];

@NgModule({
    imports: [
        IonicImageLoader.forRoot(),
        CommonModule,
        FormsModule,
        IonicModule,
        IonicModule.forRoot(),
        DragDropModule,
        MaterialModule,
        RouterModule.forChild(routes)
    ],
    declarations: [MapPage]
})
export class MapPageModule {
}
