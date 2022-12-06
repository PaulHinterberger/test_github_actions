import {Component, NgZone, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertController, ModalController, NavController, Platform} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {DataService} from 'src/app/services/data.service';
import { DebugModeComponent } from 'src/app/common-components/debug-mode/debug-mode.component';
import {RestService} from 'src/app/services/rest.service';
import {Network} from '@ionic-native/network/ngx';
import {ResultViewPage} from '../result-view/result-view.page';
import {Result} from '../../../classes/result';
import {AppVersion} from '@ionic-native/app-version/ngx';
import {Student} from 'src/app/classes/student';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {ToastController} from '@ionic/angular';



@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit {
    connected = true;
    loggedIn = false;
    debugMode: DebugModeComponent;
    version = 'release-lv-2021-20042022-0804';
    platforms = '';
    studentsPerSchool: Array<Student> = null;
    studentControl = new FormControl();
    filteredStudents: Observable<Student[]> = this.studentControl.valueChanges
        .pipe(
            startWith(''),
            map(student => student ? this._filter(student) : this.data.students.slice())
        );

    currentSchool = null;
    currentUrl=null;
    student: Student;
    studentNameFocus=false;

    constructor(public navCtrl: NavController,
                private router: Router,
                private storage: Storage,
                public rest: RestService,
                public data: DataService,
                private platform: Platform,
                private network: Network,
                private modalController: ModalController,
                public alertController: AlertController,
                private appVersion: AppVersion,
                private restService: RestService,
                private toastController: ToastController,
                private ngZone: NgZone,
                route: ActivatedRoute,) {
        route.params.subscribe(async val => {
            // console.log('HOME routed');
            // await this.reconnect();
            await this.initializeOfflineData();
            this.resetStudentFilter();
            await this.fetchRemainingResults();
            this.data.triedToSend = false;
        });

        if (this.platform.is('cordova')) {
            this.platform.ready().then(() => {
                this.connected = this.network.type !== 'unknown' && this.network.type !== 'none';
                // this.appVersion.getVersionNumber().then(data => this.version = data);

                this.network.onDisconnect().subscribe(() => {
                    this.connected = false;
                });

                this.network.onConnect().subscribe(() => {
                    this.connected = true;
                });
            });
        }
    }

    async onSet(){
        if (this.currentUrl !== undefined || this.currentUrl !== null) {
            const alert = await this.alertController.create({
                header: 'Wirklich setzen?',
                message: 'Gehen Sie sicher, dass eine funktionierende WLAN-Verbindung vorhanden ist.<br/><br/>Anderenfalls werden die Testsets aus der Liste entfernt.',
                buttons: [
                    {
                        text: 'Abbrechen',
                        handler: async () => {
                            await this.alertController.dismiss();
                        }
                    },
                    {
                        text: 'Setzen',
                        handler: async () => {
                            console.log(this.currentUrl);
                            this.rest.setBaseUrl(this.currentUrl);
                            this.data.isUrlSet=true;
                            setTimeout(() =>{
                                this.clearLocalStorage();
                            }, 500);
                            setTimeout(() => {
                                this.reconnect();
                            }, 500);
                            console.log(this.rest.baseUrl);
                        }
                    }],
                backdropDismiss: true
            });
            await alert.present();
        }
        
    }

    public async pingBackend() {
        console.log('Ping to server ' + this.rest.baseUrl);
        await this.rest.ping().then(
            async val => {
                console.log('ping ok');
                const toast = await this.toastController.create({
                    color: 'medium',
                    message: 'Ping ' + this.rest.baseUrl + ' OK',
                    duration: 5000,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'Ok',
                });
                await toast.present();
            })

            .catch(async e => {
                console.log(e);
                const toast = await this.toastController.create({
                    color: 'medium',
                    message: 'Ping ' + this.rest.baseUrl + ': ' + e.message,
                    duration: 5000,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'Ok',
                });
                await toast.present();
            });
    }

    public async reconnect() {
        this.data.blockUiButtons = true;
        console.log('Connecting with server ' + this.rest.baseUrl);
        await this.rest.checkLogin().then(
            async data => {
                this.rest.token = data;
                this.loggedIn = true;
                // await this.data.updateOfflineData();
                if(await this.data.mergeOfflineData()){     //For temporary LV-only app
                    this.resetStudentFilter();
                    const toast = await this.toastController.create({
                        color: 'medium',
                        message: 'Daten erfolgreich heruntergeladen',
                        duration: 5000,
                        position: 'bottom',
                        showCloseButton: true,
                        closeButtonText: 'Ok',
                    });
                    await toast.present();
                }                
            }).catch(async e => {
            console.log(e);
            console.log('You are offline!');
            this.loggedIn = false;
            const toast = await this.toastController.create({
                color: 'medium',
                message: 'Verbindung mit ' + this.rest.baseUrl + ' fehlgeschlagen.\nError: ' + e.message,
                duration: 5000,
                position: 'bottom',
                showCloseButton: true,
                closeButtonText: 'Ok',
            });
            await toast.present();
        });
        this.data.blockUiButtons = false;
    }

    async ngOnInit() {    
        this.data.version = this.version;
        this.debugMode = new DebugModeComponent();
        this.debugMode.checkDebugMode();
        // console.log('HOME ngOnInit');
        this.platforms = this.platform.platforms().join(' ');

        await this.storage.ready().then(() => {
            // console.log(this.storage.driver);
            this.platforms += ' ' + this.storage.driver;
        },  
        error => console.log(error));
    }

    async clearLocalStorage(){
        await this.data.clearOfflineData();
        await this.initializeOfflineData();
        this.resetStudentFilter();
        const toast = await this.toastController.create({
            color: 'medium',
            message: 'Auswahllisten zurückgesetzt',
            duration: 5000,
            position: 'bottom',
            showCloseButton: true,
            closeButtonText: 'Ok',
        });
        await toast.present();
    }

    async initializeOfflineData() {
        // enable this only to simulate a "fresh" local storage
        // await this.data.clearOfflineData();
        this.data.current_user = null;
        await this.data.loadOfflineTestsets();
        await this.data.loadOfflineSchools();
        await this.data.loadOfflineStudents();
        await this.storage.get(this.data.keyCurrentSchool).then((val) => {
            this.currentSchool = JSON.parse(val);
            //this.resetStudentFilter();
        });
    }

    async fetchRemainingResults() {
        // console.log('fetchRemainingResults');
        await this.storage.get(this.data.keyRemainingResult).then((val) => {
            if(val !== undefined && val !== null) {
                this.data.remainingResults = JSON.parse(val);
            }
            if (this.data.remainingResults.length === 1 && this.data.remainingResults[0] === null) {
                this.data.remainingResults = [];
            }
            // console.log(this.data.remainingResults);
        });
    }

    public schoolSelected() {
        // this.resetStudentFilter();
        this.storage.set(this.data.keyCurrentSchool, JSON.stringify(this.currentSchool));
    }

    private resetStudentFilter() {
        // console.log('reset Student filter');
        this.data.current_user = null;
        //this.studentsPerSchool = this.currentSchool === null ? this.data.students :  this.data.students.filter(s => s.schoolId === this.currentSchool);
        this.studentsPerSchool = this.data.students;
        // console.log('studentsPerSchool: ' + this.data.studentsPerSchool);
        this.filteredStudents = this.studentControl.valueChanges
            .pipe(
                startWith(''),
                map(student => student ? this._filter(student) : this.studentsPerSchool.slice())
            );
    }

    public clearSchool() {
        this.currentSchool = null;
        //this.resetStudentFilter();
    }

    public clearStudent() {
        this.data.current_user = null;
    }

    private _filter(value: string): Student[] {
        try {
            const filterValue = value.toLowerCase();
            return this.studentsPerSchool.filter(student => {
                //this.data.current_user = null;
                return student.name.toLowerCase().startsWith(filterValue);
            });
        } catch (e) {
        }
    }


    public noRemainingTests(): Boolean {
        return this.data.remainingResults === undefined || this.data.remainingResults === null ||
            this.data.remainingResults.length === 0 ||
            this.data.remainingResults[0] === null ||
            this.data.remainingResults.find(value => value.finished) === undefined;
    }

    newStudent() {
        // this.data.current_user = null;
        /* if(this.data.current_testset.title.toLowerCase().includes("grawo") 
            || this.data.current_testset.title.toLowerCase().includes("gralev"))
        {
            this.data.current_school = this.currentSchool;
            this.router.navigate(['data-entry-grawo']);
        }
        else if(this.data.current_testset.title.toLowerCase().includes("lernverlauf + ef") 
        || this.data.current_testset.title.toLowerCase().includes("ef") 
        || this.data.current_testset.title.toLowerCase().includes("schnapp")
        || this.data.current_testset.title.toLowerCase().includes("gradig")){ */
            //this.data.current_school=this.currentSchool;
            this.router.navigate(['data-entry-feedback']);
        /* }
        else{
            this.data.current_school = this.currentSchool;
            this.router.navigate(['data-entry-main']);
        } */
    }

    login() {
        /* if(this.data.current_testset.title.toLowerCase().includes("grawo") 
            || this.data.current_testset.title.toLowerCase().includes("gralev")){
            this.ngZone.run(()=> {
                this.router.navigate(['data-entry-grawo']);
            })
        }
        else if(this.data.current_testset.title.toLowerCase().includes("lernverlauf + ef") 
        || this.data.current_testset.title.toLowerCase().includes("ef") 
        || this.data.current_testset.title.toLowerCase().includes("schnapp")){ */
            //this.data.current_school=this.currentSchool;
            this.router.navigate(['data-entry-feedback']);
        /* }
        else{
            this.ngZone.run(() => {
                this.router.navigate(['data-entry-main']);
            });
        } */
    }

    async seeResult(result: Result) {
        const modal = await this.modalController.create({
            component: ResultViewPage,
            backdropDismiss: false,
            cssClass: 'result-view',
            componentProps: {
                result: JSON.parse(JSON.stringify(result))
            }
        });

        await modal.present();
    }

    isBtnDisabled(): boolean {
        return (this.data.current_user === null) || (!this.data.current_user.name) || this.data.current_testset === null;
    }


    getTestSetTitleFromId(testSetId: string): String {
        if (this.data.testSets) {
            if (this.data.testSets.find(t => t.id === testSetId)) {
                return this.data.testSets.find(t => t.id === testSetId).title;
            }
        }
        return '';
    }

    getSendedResultStatus(result:Result){
        if(result.sendedResult){
            return "Bereits Hochgeladen";
        }
        else{
            return "Noch nicht hochgeladen";
        }
    }

    getResultStatus(result: Result){
        if(result.finished && result.schreibenEvaluated == false){
            return "Noch nicht bewertet";
        }
        else {
            return "Nicht abgeschlossen";
        }
    }

    displayStudent(student: Student) {
        if (student) {
            return student.name;
        }
    }

    saveTextToJson(text, filename) {
        const a = document.createElement('a');
        a.setAttribute('href', 'data:text/plain;charset=utf-u,' + encodeURIComponent(text));
        a.setAttribute('download', filename);
        a.click();
    }

    continue(result: Result) {
        // console.log('continue');
        this.data.continueResult(result);
    }
}
