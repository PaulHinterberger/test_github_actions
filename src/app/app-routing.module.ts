import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { HomePage } from './pages/home/home/home.page';
import { DataEntryAnamnesePage } from './pages/home/data-entry-anamnese/data-entry-anamnese.page';
import { DataEntryMainPage } from './pages/home/data-entry-main/data-entry-main.page';
import { DataEntryGrawoPage } from './pages/home/data-entry-grawo/data-entry-grawo.component';
import { ChildrenFeedbackPage } from './pages/feedback/children-feedback/children-feedback.page';
import { DataEntryFeedbackComponent } from './pages/home/data-entry-feedback/data-entry-feedback.component';


const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},

  {path: 'home', component: HomePage},
  {path: 'data-entry-main', component: DataEntryMainPage},
  {path: 'data-entry-anamnese', component: DataEntryAnamnesePage},
  {path: 'data-entry-grawo', component: DataEntryGrawoPage},
  {path: 'data-entry-feedback', component: DataEntryFeedbackComponent},
  
  {path: 'feedback', loadChildren: './pages/feedback/children-feedback/children-feedback.module#ChildrenFeedbackPageModule'},

  {path: 'exercise-finished', loadChildren: './common-components/exercise-finished/exercise-finished.module#ExerciseFinishedPageModule'},

  {path: 'schnapp-reimen', loadChildren: './pages/schnapp/schnapp-reimen/schnapp-reimen.module#SchnappReimenPageModule'},
  {path: 'schnapp-wortmerken', loadChildren: './pages/schnapp/schnapp-wortmerken/schnapp-wortmerken.module#SchnappWortmerkenPageModule'},
  {path: 'schnapp-nachsprechen-vorwaerts', loadChildren: './pages/schnapp/schnapp-nachsprechen-vorwaerts/schnapp-nachsprechen-vorwaerts.module#SchnappNachsprechenVorwaertsPageModule'},
  {path: 'schnapp-buchstabenwissen', loadChildren: './pages/schnapp/schnapp-buchstabenwissen/schnapp-buchstabenwissen.module#SchnappBuchstabenwissenPageModule'},
  {path: 'schnapp-silben', loadChildren: './pages/schnapp/schnapp-silben/schnapp-silben.module#SchnappSilbenPageModule'},
  {path: 'schnapp-saetze-nachsprechen', loadChildren: './pages/schnapp/schnapp-saetze-nachsprechen/schnapp-saetze-nachsprechen.module#SchnappSaetzeNachsprechenPageModule'},
  {path: 'schnapp-benennen-a', loadChildren: './pages/schnapp/schnapp-benennen-a/schnapp-benennen-a.module#SchnappBenennenAPageModule'},
  {path: 'schnapp-benennen-b', loadChildren: './pages/schnapp/schnapp-benennen-b/schnapp-benennen-b.module#SchnappBenennenBPageModule'},
  {path: 'schnapp-anlaute-erkennen', loadChildren: './pages/schnapp/schnapp-anlaute-erkennen/schnapp-anlaute-erkennen.module#SchnappAnlauteErkennenPageModule'},
  {path: 'schnapp-nachsprechen-rueckwaerts', loadChildren: './pages/schnapp/schnapp-nachsprechen-rueckwaerts/schnapp-nachsprechen-rueckwaerts.module#SchnappNachsprechenRueckwaertsPagePageModule'},
  {path: 'schnapp-passiver-wortschatz', loadChildren: './pages/schnapp/schnapp-passiver-wortschatz/schnapp-passiver-wortschatz.module#SchnappPassiverWortschatzPageModule'}, 
  {path: 'schnapp-nonverbale-intelligenz-a', loadChildren: './pages/schnapp/schnapp-nonverbale-intelligenz-a/schnapp-nonverbale-intelligenz-a.module#SchnappNonverbaleIntelligenzAPageModule'},
  {path: 'schnapp-nonverbale-intelligenz-b', loadChildren: './pages/schnapp/schnapp-nonverbale-intelligenz-b/schnapp-nonverbale-intelligenz-b.module#SchnappNonverbaleIntelligenzBPageModule'},
  {path: 'schnapp-nonverbale-intelligenz-between', loadChildren: './pages/schnapp/schnapp-nonverbale-intelligenz-between/schnapp-nonverbale-intelligenz-between.module#SchnappNonverbaleIntelligenzBetweenPageModule'},

  {path: 'map/:state', loadChildren: './pages/schnapp/map/map.module#MapPageModule'},

  {path: 'lv-silben', loadChildren: './pages/lernverlauf/lv-silben/lv-silben.module#LvSilbenPageModule'},
  {path: 'lv-silben1', loadChildren: './pages/lernverlauf/lv-silben1/lv-silben1.module#LvSilben1PageModule'},
  {path: 'lv-silben2', loadChildren: './pages/lernverlauf/lv-silben2/lv-silben2.module#LvSilben2PageModule'},
  {path: 'lv-silben3', loadChildren: './pages/lernverlauf/lv-silben3/lv-silben3.module#LvSilben3PageModule'},
  {path: 'lv-silben4', loadChildren: './pages/lernverlauf/lv-silben4/lv-silben4.module#LvSilben4PageModule'},
  {path: 'lv-lesen', loadChildren: './pages/lernverlauf/lv-lesen/lv-lesen.module#LvLesenPageModule'},
  {path: 'lv-schreiben', loadChildren: './pages/lernverlauf/lv-schreiben/lv-schreiben.module#LvSchreibenPageModule'},

  {path: 'lv-schreiben-evaluation', loadChildren: './pages/lernverlauf/lv-schreiben-evaluation/lv-schreiben-evaluation.module#LvSchreibenEvaluationPageModule'},
  {path: 'lv-bereit', loadChildren: './pages/lernverlauf/lv-bereit/lv-bereit.module#LvBereitPageModule'},
 
  {path: 'lv-map-start', loadChildren: './pages/lernverlauf/lv-map-start/lv-map-start.module#LvMapStartPageModule'},
  {path: 'lv-map-lesen', loadChildren: './pages/lernverlauf/lv-map-lesen/lv-map-lesen.module#LvMapLesenPageModule'},
  {path: 'lv-map-schreiben', loadChildren: './pages/lernverlauf/lv-map-schreiben/lv-map-schreiben.module#LvMapSchreibenPageModule'},
  {path: 'lv-map-ende', loadChildren: './pages/lernverlauf/lv-map-ende/lv-map-ende.module#LvMapEndePageModule'},
 
  { path: 'exercise-word', loadChildren: './pages/gralev/exercise-word/exercise-word.module#ExerciseWordPageModule'},
  { path: 'exercise-sentence', loadChildren: './pages/gralev/exercise-sentence/exercise-sentence.module#ExerciseSentencePageModule'},
  { path: 'exercise-nonsense-stories', loadChildren: './pages/gralev/exercise-nonsense-stories/exercise-nonsense-stories.module#ExerciseNonsenseStoriesPageModule'},
  { path: 'exercise-text', loadChildren: './pages/gralev/exercise-text/exercise-text.module#ExerciseTextPageModule'},
  { path: 'gralev-first-text', loadChildren: './pages/gralev/gralev-first-text/gralev-first-text.module#GralevFirstTextPageModule' },
  { path: 'gralev-second-text', loadChildren: './pages/gralev/gralev-second-text/gralev-second-text.module#GralevSecondTextPageModule' },
  { path: 'gralev-third-text', loadChildren: './pages/gralev/gralev-third-text/gralev-third-text.module#GralevThirdTextPageModule' },
  { path: 'gralev-fourth-text', loadChildren: './pages/gralev/gralev-fourth-text/gralev-fourth-text.module#GralevFourthTextPageModule' },
  { path: 'gralev-end-text', loadChildren: './pages/gralev/gralev-end-text/gralev-end-text.module#GralevEndTextPageModule' },
  { path: 'feedback-connector', loadChildren: './pages/feedback/feedback-connector/feedback-connector.module#FeedbackConnectorPageModule' },
  { path: 'adult-feedback', loadChildren: './pages/feedback/adult-feedback/adult-feedback.module#AdultFeedbackPageModule' },
{ path: 'subtest1', loadChildren: './pages/gradig/subtest1/subtest1.module#Subtest1PageModule' },
  { path: 'subtest2', loadChildren: './pages/gradig/subtest2/subtest2.module#Subtest2PageModule' },
  { path: 'subtest3', loadChildren: './pages/gradig/subtest3/subtest3.module#Subtest3PageModule' },
  { path: 'subtest4', loadChildren: './pages/gradig/subtest4/subtest4.module#Subtest4PageModule' },
  { path: 'lv-lesen-nominal', loadChildren: './pages/lernverlauf/lv-lesen-nominal/lv-lesen-nominal.module#LvLesenNominalPageModule' },
  { path: 'schnapp-bereit', loadChildren: './pages/schnapp/schnapp-bereit/schnapp-bereit.module#SchnappBereitPageModule' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule,

  ]
})
export class AppRoutingModule {
}
