import {Component} from '@angular/core';

import { Platform } from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private screenOrientation: ScreenOrientation,
        private permissions: AndroidPermissions
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            if (this.platform.is('cordova') || this.platform.is('capacitor')) {
                this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
                if (this.platform.is('android')) {
                    this.permissions.requestPermissions([
                        'INTERNET',
                        'ACCESS_WIFI_STATE'
                    ]).then();
                }
            }
        });
        document.addEventListener('backbutton', function(e) {
            console.log('disable back button');
          }, false);
    }
}
