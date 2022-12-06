
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; 

import {HomePage} from './pages/home/home/home.page';
import {DataEntryMainPage} from './pages/home/data-entry-main/data-entry-main.page';
import {DataEntryAnamnesePage} from './pages/home/data-entry-anamnese/data-entry-anamnese.page';
import {DataEntryGrawoPage} from './pages/home/data-entry-grawo/data-entry-grawo.component';
import { ResultViewPage } from './pages/home/result-view/result-view.page';

import {SchnappReimenPage} from './pages/schnapp/schnapp-reimen/schnapp-reimen.page';
import {SchnappWortmerkenPage} from './pages/schnapp/schnapp-wortmerken/schnapp-wortmerken.page';
import {SchnappNachsprechenVorwaertsPage} from './pages/schnapp/schnapp-nachsprechen-vorwaerts/schnapp-nachsprechen-vorwaerts.page';
import {SchnappBuchstabenwissenPage} from './pages/schnapp/schnapp-buchstabenwissen/schnapp-buchstabenwissen.page';
import {SchnappSilbenPage} from './pages/schnapp/schnapp-silben/schnapp-silben.page';
import {SchnappSaetzeNachsprechenPage} from './pages/schnapp/schnapp-saetze-nachsprechen/schnapp-saetze-nachsprechen.page';
import {SchnappBenennenAPage} from './pages/schnapp/schnapp-benennen-a/schnapp-benennen-a.page';
import {SchnappBenennenBPage} from './pages/schnapp/schnapp-benennen-b/schnapp-benennen-b.page';
import {SchnappAnlauteErkennenPage} from './pages/schnapp/schnapp-anlaute-erkennen/schnapp-anlaute-erkennen.page';
import {SchnappNachsprechenRueckwaertsPage} from './pages/schnapp/schnapp-nachsprechen-rueckwaerts/schnapp-nachsprechen-rueckwaerts.page';
import {SchnappPassiverWortschatzPage} from './pages/schnapp/schnapp-passiver-wortschatz/schnapp-passiver-wortschatz.page';
import {SchnappNonverbaleIntelligenzAPage} from './pages/schnapp/schnapp-nonverbale-intelligenz-a/schnapp-nonverbale-intelligenz-a.page';
import {SchnappNonverbaleIntelligenzBPage} from './pages/schnapp/schnapp-nonverbale-intelligenz-b/schnapp-nonverbale-intelligenz-b.page';

import {LvSilbenPage} from './pages/lernverlauf/lv-silben/lv-silben.page';
import {LvLesenPage} from './pages/lernverlauf/lv-lesen/lv-lesen.page';
import {LvSchreibenPage} from './pages/lernverlauf/lv-schreiben/lv-schreiben.page'
import { LvSchreibenEvaluationPage } from './pages/lernverlauf/lv-schreiben-evaluation/lv-schreiben-evaluation.page';

import {AlertController, IonicModule, IonicRouteStrategy, ModalController} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {File} from '@ionic-native/file/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './app.material/app.material.module';
import {HttpClientModule} from '@angular/common/http';
import {NativeAudio} from '@ionic-native/native-audio/ngx';

import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

import {IonicImageLoader} from 'ionic-image-loader';
import {WebView} from '@ionic-native/ionic-webview/ngx';
import {Network} from '@ionic-native/network/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IonicStorageModule } from '@ionic/storage';
import { ExerciseGraLeVWord } from './classes/exercises/exerciseGraLeVWord';
import { ExerciseTextPageModule } from './pages/gralev/exercise-text/exercise-text.module';
import { ExerciseNonsenseStoriesPageModule } from './pages/gralev/exercise-nonsense-stories/exercise-nonsense-stories.module';
import { ExerciseWordPage } from './pages/gralev/exercise-word/exercise-word.page';

//import { DebugModeComponent } from './components/debug-mode/debug-mode.component';
//import { DebugModeModule } from './components/debug-mode/debug-mode.module';
import { GralevFirstTextPage } from './pages/gralev/gralev-first-text/gralev-first-text.page';
import { GralevSecondTextPage } from './pages/gralev/gralev-second-text/gralev-second-text.page';
import { GralevThirdTextPage } from './pages/gralev/gralev-third-text/gralev-third-text.page';
import { GralevFourthTextPage } from './pages/gralev/gralev-fourth-text/gralev-fourth-text.page';
import { GralevEndTextPage } from './pages/gralev/gralev-end-text/gralev-end-text.page';
import { ExerciseTextPage } from './pages/gralev/exercise-text/exercise-text.page';
import { ExerciseSentencePage } from './pages/gralev/exercise-sentence/exercise-sentence.page';
import { ExerciseNonsenseStoriesPage } from './pages/gralev/exercise-nonsense-stories/exercise-nonsense-stories.page';
import { ChildrenFeedbackPage } from './pages/feedback/children-feedback/children-feedback.page';
import { DataEntryFeedbackComponent } from './pages/home/data-entry-feedback/data-entry-feedback.component';


@NgModule({
    declarations: [
        AppComponent,
        HomePage,
        ResultViewPage,
        DataEntryMainPage,
        DataEntryAnamnesePage,
        DataEntryGrawoPage,
        DataEntryFeedbackComponent
    ],
    entryComponents: [
        HomePage,
        ResultViewPage,
        DataEntryMainPage,
        DataEntryAnamnesePage,
        DataEntryGrawoPage
    ],
    imports: [
        IonicImageLoader.forRoot(),
        IonicModule.forRoot({
            mode: 'md',
        }),
        IonicStorageModule.forRoot(),
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        ServiceWorkerModule.register('./ngsw-worker.js', {enabled: environment.production}),
        DragDropModule
    ],
    providers: [
        AppVersion,
        WebView,
        StatusBar,
        ScreenOrientation,
        File,
        SplashScreen,
        NativeAudio,
        HTTP,
        AndroidPermissions,
        Network,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
