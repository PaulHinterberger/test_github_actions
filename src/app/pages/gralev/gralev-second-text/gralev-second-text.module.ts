import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GralevSecondTextPage } from './gralev-second-text.page';
import { MatGridListModule } from '@angular/material';
//import { NoteModule } from 'src/app/components/note/note.module';
//import { NextPageButtonModule } from 'src/app/components/next-page-button/next-page-button.module';

const routes: Routes = [
  {
    path: '',
    component: GralevSecondTextPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    //NoteModule,
    //NextPageButtonModule
  ],
  declarations: [GralevSecondTextPage]
})
export class GralevSecondTextPageModule {}
