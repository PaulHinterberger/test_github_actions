import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {MaterialModule} from '../app.material/app.material.module';
import {NoteComponent} from './note/note.component';
import {NextPageButtonComponent} from './next-page-button/next-page-button.component';
import {LastPageButtonComponent} from './last-page-button/last-page-button.component';
import {DebugModeComponent} from './debug-mode/debug-mode.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        MaterialModule,
    ],
    declarations: [
        NoteComponent,
        NextPageButtonComponent,
        LastPageButtonComponent,
        DebugModeComponent


    ],
    exports: [
        NoteComponent,
        NextPageButtonComponent,
        LastPageButtonComponent,
        DebugModeComponent
    ]
})
export class CommonComponentsModule {
}
