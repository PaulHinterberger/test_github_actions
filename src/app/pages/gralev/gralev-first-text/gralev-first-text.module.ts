import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GralevFirstTextPage } from './gralev-first-text.page';
import { MatGridListModule } from '@angular/material';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
//import { NoteModule } from 'src/app/components/note/note.module';
//import { NextPageButtonModule } from 'src/app/components/next-page-button/next-page-button.module';

const routes: Routes = [
  {
    path: '',
    component: GralevFirstTextPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    CommonComponentsModule,
    //NoteModule,
    //NextPageButtonModule
  ],
  declarations: [GralevFirstTextPage]
})
export class GralevFirstTextPageModule {}
