import {Injectable} from '@angular/core';
import {Result} from '../classes/result';
import {Student} from '../classes/student';
import {Examiner} from '../classes/examiner';
import {Storage} from '@ionic/storage';
import {ToastController, AlertController} from '@ionic/angular';
import {Router} from '@angular/router';
import {TestTemplate} from '../classes/testTemplate';
import {School} from '../classes/school';
import {Exercise} from '../classes/exercise';
import { SchnappReimenExercise } from '../classes/exercises/schnappReimenExercise';
import {SchnappWortmerkenExercise} from '../classes/exercises/schnappWortmerkenExercise';
import {SchnappNachsprechenVorwaertsExercise} from '../classes/exercises/schnappNachsprechenVorwaertsExercise';
import {SchnappBuchstabenwissenExercise} from '../classes/exercises/schnappBuchstabenwissenExercise';
import {SchnappNonverbaleIntelligenzExercise} from '../classes/exercises/schnappNonverbaleIntelligenzExercise';
import {SchnappPassiverWortschatzExercise} from '../classes/exercises/schnappPassiverWortschatzExercise';
import {SchnappNachsprechenRueckwaertsExercise} from '../classes/exercises/schnappNachsprechenRueckwaertsExercise';
import {SchnappAnlauteErkennenExercise} from '../classes/exercises/schnappAnlauteErkennenExercise';
import {SchnappSilbenExercise} from '../classes/exercises/schnappSilbenExercise';
import {SchnappBenennenExercise} from '../classes/exercises/schnappBenennenExercise';
import {SchnappSaetzeNachsprechenExercise} from '../classes/exercises/schnappSaetzeNachsprechenExercise';
import schooldata from '../../assets/data/schools.json';
import testsetdata from '../../assets/data/testsets.json';
import studentdata from '../../assets/data/students.json';
import {RestService} from './rest.service';
import {forEach} from '@angular-devkit/schematics';
import { UrlClass } from '../classes/urlClass';

@Injectable({
    providedIn: 'root'
})


export class DataService {
    result: Result;
    public remainingResults: Result[] = [];;
    triedToSend = false;
    public indexIsSended=0;
    blockUiButtons = false;
    isAudioPlaying = false;
    isAudioFinished = false;
    keyRemainingResult = 'remainingResults';
    keyOfflineSchools = 'offlineSchools';
    keyOfflineTestTemplates = 'offlineTestTemplates';
    keyOfflineStudents = 'offlineStudents';
    keyCurrentSchool = 'currentSchool';
    keyCurrentExaminer = 'currentExaminer';
    current_testset: TestTemplate = null;
    current_user: Student = null;
    current_school = null;
    current_url:UrlClass = null;
    isUrlSet = false;
    urls: Array<UrlClass>=[new UrlClass("https://schnapp-l.htl-leonding.ac.at/grawo/end/api/", 'GRAZ'), new UrlClass("https://schnapp-l.htl-leonding.ac.at/end/api/", 'LINZ')];
    schools: Array<School> = [];
    students: Array<Student> = [];
    testSets: Array<TestTemplate> = [];
    schreibenExercise: Array<String> = ['gute', 'Regen', 'Nadel', 'gegen', 'Wiese', 'Diebe', 'Hunde', 'Mantel', 'denken', 'Kater', 'Kinder', 'dunkel', 'lernen', 'Daumen', 'Käfer', 'Spaten', 'schwarze', 'Frösche', 'Schweine', 'immer', 'Mücken', 'zischen', 'Wecker', 'Finger', 'Gipfel', 'stellen'
        , 'Knochen', 'Ruhe', 'Fahne', 'nehmen', 'Haut', 'Tor', 'Pilz', 'Korb', 'Stein', 'Kran', 'zwölf', 'Prinz', 'Gespenster', 'Prinzessin', 'vorne'];
    version = "";



    constructor(
        private storage: Storage,
        private restService: RestService,
        private toastController: ToastController,
        private router: Router,
        public alertController: AlertController
    ) {
    }

    initNewTest(student: Student, examiner: Examiner, testDate: Date) {  // TODO Marcel
        let exerciseResults: Exercise[];

        if (this.current_testset.title.toLowerCase().includes('grawo')) {
            exerciseResults = [new SchnappPassiverWortschatzExercise()];
        } else {
            exerciseResults = [];
        }
        this.result = new Result(student, examiner, testDate, this.version, exerciseResults, this.current_testset.id);
    }

    setExerciseProperties(exercise: Exercise){
        if(this.current_testset !== null && this.current_testset !== undefined){
            exercise.number = this.getExerciseNumber();
            exercise.title = this.current_testset.exercises
                .find(e => e.route == exercise.route)
                .title;
        }        
    }

    getExerciseNumber() {
        return this.result.results.length + 1;
    }

    getExerciseByNumber(number: number) {
        return this.result.results.find(x => x.number === number);
    }

    getExerciseResultByRoute(route: string){
        return this.result.results.find(e => e.route == route);
    }

    getExerciseByRoute(route: string){
        return this.current_testset.exercises.find(exercise => exercise.route == route);
    }

    continueResult(result: Result) {
        // console.log('Continue result: ');
        // console.log(result);
        this.result = result;
        this.current_testset = this.testSets.find(t => t.id === result.testTemplateId);
        // console.log(this.current_testset);
        this.current_user = result.student;
        if(result.results.length == 0){
            this.router.navigate([this.current_testset.exercises[0].route])
        }
        else{
            var route = result.results[result.results.length - 1].route;
            console.log("Last exercise route was: " + route);
            // console.log(this.result.results);
            if(result.results[result.results.length-1].finished == false){
                if(route == 'schnapp-nonverbale-intelligenz-a'){
                    this.router.navigate(['schnapp-nonverbale-intelligenz-b']);
                }
                else if(route == 'schnapp-benennen-a'){
                    this.router.navigate(['schnapp-benennen-b']);
                }
                else{
                    this.router.navigate([route]);
                }                
            }
            else{
                this.router.navigate([this.getNextExerciseRoute(route)]);                
            }            
        }
    }


    async saveResult(returnToHomeScreen: Boolean) {
        try{
            // console.log('Save result');
            const index = this.remainingResults.findIndex(
                value => value.student.name === this.result.student.name &&
                value.testingDate === this.result.testingDate);
            if (index !== -1) {
                console.log('Removing result #' + index);
                this.remainingResults.splice(index, 1, this.result);
            }
            else{
                console.log("Result has not been in remainingResults yet");
                this.remainingResults.push(this.result);
            }
            // console.log(this.result);
            console.log('Result saved to remaining results: ');
            console.log(this.remainingResults);
            await this.saveDataIntoStorage(this.keyRemainingResult, this.remainingResults,'Ergebnisse wurden gespeichert!');
        }
        catch (error)
        {
            console.error(error);
            this.showAlert(error);
        }
   

        if (returnToHomeScreen) {
            this.router.navigate(['home']);
        }
    }
      
    async removeResult(result: Result) {
        const index = this.remainingResults.findIndex(
            value => value.student.name === result.student.name &&
                value.testingDate === result.testingDate);
        if (index != -1) {
            // console.log('Removing result #' + index);
            this.remainingResults.splice(index, 1);
           // await this.storage.set(this.keyRemainingResult, JSON.stringify(this.remainingResults));
           this. saveDataIntoStorage(this.keyRemainingResult, this.remainingResults,'Ergebnis wurde entfernt!');
        }
    }

    async updateOfflineData() {

        try{
            await this.restService.getTestTemplate().toPromise().then(async value => {
                let current = this.current_testset ? this.current_testset.id : -1;
                this.testSets = value || this.testSets;
                this.current_testset = this.testSets.find(t => t.id === current);
                await this.storage.set(this.keyOfflineTestTemplates, JSON.stringify(this.testSets));
            });
            // this.mapTestSetsTypesafe();
     
            await this.restService.getStudents().toPromise().then(async value => {
                this.students = value || this.students;
                await this.storage.set(this.keyOfflineStudents, JSON.stringify(this.students));
            });
               
            await this.restService.getSchools().toPromise().then(async value => {
                this.schools = value || this.schools;
                await this.storage.set(this.keyOfflineSchools, JSON.stringify(this.schools))
            });
        } catch(ex) {
            console.log("Exception loading offline data");
            console.log(ex);
        } 
        

        // const toast = await this.toastController.create({
        //     color: 'medium',
        //     message: 'Offline Daten wurden aktualisiert!',
        //     duration: 5000,
        //     position: 'bottom',
        //     showCloseButton: true,
        //     closeButtonText: 'Ok',
        // });
        // await toast.present();
    }

    async mergeOfflineData() {

        try{
            await this.restService.getTestTemplate().toPromise().then(async value => {
                let current = this.current_testset ? this.current_testset.id : -1;
                if(value !== null && value !== undefined){
                    value.forEach(testTemplate => {
                        var index = this.testSets.findIndex(t => t.id == testTemplate.id)
                        if(index != -1){
                            this.testSets.splice(index, 1, testTemplate);
                        }
                        else{
                            this.testSets.push(testTemplate);
                        }
                    });
                }
                this.current_testset = this.testSets.find(t => t.id === current);
                await this.storage.set(this.keyOfflineTestTemplates, JSON.stringify(this.testSets));
            });
     
            await this.restService.getStudents().toPromise().then(async value => {
                this.students = value || this.students;
                await this.storage.set(this.keyOfflineStudents, JSON.stringify(this.students));
            });
               
            await this.restService.getSchools().toPromise().then(async value => {
                this.schools = value || this.schools;
                await this.storage.set(this.keyOfflineSchools, JSON.stringify(this.schools))
            });
            return true;
        } catch(ex) {
            console.log("Exception merging offline data");
            console.log(ex);
            return false;
        }
    }

    async clearOfflineData() {
        await this.storage.set(this.keyOfflineSchools, null);
        await this.storage.set(this.keyOfflineTestTemplates, null);
        await this.storage.set(this.keyOfflineStudents, null);
    }

    async loadOfflineSchools() {
        this.schools = schooldata;
        //console.log(this.schools);
        await this.storage.get(this.keyOfflineSchools).then((val) => {
            if (val != undefined && val != null) {
                //console.log('fetched schools from  local storage: ' + val);
                this.schools = JSON.parse(val);
            } else {
                //console.log('store offline schools to local storage: ' + JSON.stringify(this.schools));
                this.storage.set(this.keyOfflineSchools, JSON.stringify(this.schools));
            }
        });
        //console.log('offline schools:');
        //console.log(this.schools);
    }

    async loadOfflineTestsets() {
        this.testSets = testsetdata;
        this.testSets = this.testSets.filter(testset => testset.active);
        let current = this.current_testset ? this.current_testset.id : -1;      
        //console.log(this.schools);
        await this.storage.get(this.keyOfflineTestTemplates).then((val) => {
            if (val !== undefined && val !== null) {
                //console.log('fetched testsets local storage: ' + val);
                this.testSets = JSON.parse(val);
                // this.mapTestSetsTypesafe();
            } else {
                //console.log('store offline data into local storage: ' + JSON.stringify(this.testSets));
                // this.mapTestSetsTypesafe();
                this.storage.set(this.keyOfflineTestTemplates, JSON.stringify(this.testSets));
            }
        });
        this.current_testset = this.testSets.find(t => t.id === current);
        //console.log('offline testsets:');
        //console.log(this.testSets);
    }

    //JSON.parse parses to type any, this method parses the testsets and exercises to be type-safe
    mapTestSetsTypesafe(){
        this.testSets.forEach(testSet =>{
            testSet = Object.assign(new TestTemplate(testSet.title, testSet.id, testSet.active, testSet.exercises), testSet)
            testSet.exercises.forEach(e => {
                e = Object.assign(new Exercise(/*e.number,*/ e.title, e.route/*, e.note, e.finished*/), e)
            })
        })
        this.testSets.forEach(testSet =>{
            console.log(testSet.constructor.name + " " + testSet.title);
            testSet.exercises.forEach(e => {
                console.log("   " + e.constructor.name + " " + e.title)
            })
        })
    }

    async loadOfflineStudents() {
        // Students Fehler?
        this.students = studentdata;
        // console.log(this.students);
        await this.storage.get(this.keyOfflineStudents).then((val) => {
            if (val != undefined) {
                //console.log('fetched students from local storage: ' + val);
                this.students = JSON.parse(val);
            } else {
                //console.log('store offline students into local storage: ' + JSON.stringify(this.students));
                this.storage.set(this.keyOfflineStudents, JSON.stringify(this.students));
            }
        });
        //console.log('offline testsets:');
        //console.log(this.testSets);
    }

    getNextExerciseRoute(currentRoute: string) : string{  
        //console.log(this);
        if (!this.current_testset){
            console.log("no testset => returning to home");
            return 'home';
        }
        var exercisesLength = this.current_testset.exercises.length;
        for (let index = 0; index < exercisesLength; index++) {
            if(this.current_testset.exercises[index].route == currentRoute && index < exercisesLength - 1){
                return this.current_testset.exercises[index + 1].route;
            }
        }
        console.log("No more exercises, routing to finale page");
        this.result.endDate = new Date();
        this.result.finished = true;
        console.log("Result:");
        console.log(this.result);
        this.saveResult(false);
        this.current_user = null;
        this.current_testset = null;
        return 'home';
    }

    getSchoolById(schoolId: string) {
        if (this.schools != null && schoolId !== '') {
            return this.schools.find(s => s.id === schoolId);
        } else {
            // console.log(schoolId);
            return new School('0', 'SchoolDummy', []);
        }
    }

    getSchoolByName(schoolName: string) {
        if (this.schools != null && schoolName !== '') {
            return this.schools.find(s => s.name === schoolName);
        } else {
            // console.log(schoolId);
            return new School('0', 'SchoolDummy', []);
        }
    }

    async sendTest() {
        this.triedToSend = true;
        var save = false;
        var error = '';
        if (this.restService.token === null) {
            await this.restService.checkLogin().then(
                data => {
                    this.restService.token = data;
                },
                async err => {
                    console.log('Cannot login to server (probably no connection to server)');
                });
            if (this.restService.token === null) {
                error = 'Verbindung zu Server fehlgeschlagen';
            }
        }
        if (this.restService.token != null) {
            await this.restService
                .sendResults(this.result).then(
                    data => {
                        save = true;
                    },
                    async err => {
                        error = 'Ergebnis konnte nicht gesendet werden';
                        console.log('Error when calling sendResult');
                        save = false;
                    });
        }
        if (save) {
            const index = this.remainingResults.indexOf(this.result);
            this.remainingResults.splice(index);
            // this.storage.set(this.keyRemainingResult, JSON.stringify(this.remainingResults));
            await this. saveDataIntoStorage(this.keyRemainingResult, this.remainingResults, 'Test wurde gesendet!');
           /* const alert = await this.alertController.create({
                header: 'Erfolgreich',
                message: 'Die Testung wurde erfolgreich hochgeladen!',
                buttons: [{
                    text: 'Ok',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                ],
                backdropDismiss: true
            });
            await alert.present();*/
        } else {
            const alert = await this.alertController.create({
                header: 'Nicht erfolgreich',
                message: error,
                buttons: [{
                    text: 'Ok',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                ],
                backdropDismiss: true
            });
            await alert.present();
        }
    }

    async sendResult(result:Result){
        this.blockUiButtons = true;
        var save = false;
        var error = '';
        if (this.restService.token === null) {
            await this.restService.checkLogin().then(
                data => {
                    this.restService.token = data;
                },
                async err => {
                    console.log('Cannot login to server (probably no connection to server)');
                });
            if (this.restService.token === null) {
                error = 'Verbindung zu Server fehlgeschlagen';
            }
        }
        this.indexIsSended = this.remainingResults.findIndex(x=>x.endDate===result.endDate);
        if (this.restService.token != null) {
            // console.log(this.data.remainingResults);
            if (this.remainingResults[this.indexIsSended].finished && 
                (this.remainingResults[this.indexIsSended].schreibenEvaluated == true || 
                    this.remainingResults[this.indexIsSended].schreibenEvaluated == null)) {
                await this.restService
                    .sendResults(this.remainingResults[this.indexIsSended]).then(
                    data => {
                        // this.remainingResults.splice(i, 1);
                        // i--;
                        this.remainingResults[this.indexIsSended].sendedResult=true;
                        this. saveDataIntoStorage(this.keyRemainingResult, this.remainingResults, 'Ergebnisse gesendet');
                        // this.storage.set(this.keyRemainingResult, JSON.stringify(this.remainingResults));
                        save = true;
                    },
                    async err => {
                        console.log(err);
                        error = err.error;
                        save = false;
                    });
            }
        }
        if (save) {
            const alert = await this.alertController.create({
                header: 'Erfolgreich',
                message: 'Die Testungen wurde erfolgreich hochgeladen!',
                buttons: [{
                    text: 'Ok',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                ],
                backdropDismiss: true
            });
            await alert.present();
        } else {
            const alert = await this.alertController.create({
                header: 'Nicht erfolgreich',
                message: error,
                buttons: [{
                    text: 'Ok',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                ],
                backdropDismiss: true
            });
            await alert.present();
        }
        this.remainingResults[this.indexIsSended].sendedResult=true;
        this.blockUiButtons = false;
    }

    async sendRemainingResults(){
        this.blockUiButtons = true;
        var save = false;
        var error = '';
        if (this.restService.token === null) {
            await this.restService.checkLogin().then(
                data => {
                    this.restService.token = data;
                },
                async err => {
                    console.log('Cannot login to server (probably no connection to server)');
                });
            if (this.restService.token === null) {
                error = 'Verbindung zu Server fehlgeschlagen';
            }
        }
        if (this.restService.token != null) {
            for (let i = 0; i < this.remainingResults.length; i++) {
                // console.log(this.data.remainingResults);
                if (this.remainingResults[i].finished && (this.remainingResults[i].schreibenEvaluated == true || this.remainingResults[i].schreibenEvaluated == null)) {
                    await this.restService
                        .sendResults(this.remainingResults[i]).then(
                        data => {
                            // this.remainingResults.splice(i, 1);
                            // i--;
                            this. saveDataIntoStorage(this.keyRemainingResult, this.remainingResults, 'Ergebnisse gesendet');
                            // this.storage.set(this.keyRemainingResult, JSON.stringify(this.remainingResults));
                            save = true;
                        },
                        async err => {
                            console.log(err);
                            error = err.error;
                            save = false;
                        });
                }
            }
        }
        if (save) {
            const alert = await this.alertController.create({
                header: 'Erfolgreich',
                message: 'Die Testungen wurde erfolgreich hochgeladen!',
                buttons: [{
                    text: 'Ok',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                ],
                backdropDismiss: true
            });
            await alert.present();
        } else {
            const alert = await this.alertController.create({
                header: 'Nicht erfolgreich',
                message: error,
                buttons: [{
                    text: 'Ok',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                ],
                backdropDismiss: true
            });
            await alert.present();
        }
        this.blockUiButtons = false;
    }



    async saveDataIntoStorage(keyRemainingResult: string, remainingResults: Result[], toastMsg: string) {
        try {
              await this.storage.set(keyRemainingResult, JSON.stringify(remainingResults));
              this.showToast(toastMsg);             
        }
        catch (error) {
            console.error(error);
            this.showAlert(error);
            this.showAlert('Daten wurden nicht respeichert!');
        }
    }
    async showAlert(msg) {
        const alert = await this.alertController.create({
            header: 'FEHLER-FOTOGRAFIEREN!!!!',
            subHeader: 'ES WURDE NICHT GESPEICHERT!',
            message: msg,
            buttons: [{
                text: 'Ok',
                handler: async () => {
                    await this.alertController.dismiss();
                }
            },
            ],
            backdropDismiss: true
        });
        await alert.present();
    }
    async showToast(msg: string ) {
        const toast = await this.toastController.create({
            color: 'medium',
            message: msg,
            position: 'bottom',
            duration: 1000,
            showCloseButton: true,
            closeButtonText: 'Ok',
        });
        await toast.present();
    }
}
