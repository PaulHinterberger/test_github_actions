import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController} from '@ionic/angular';
import {Result} from 'src/app/classes/result';
import {DataService} from 'src/app/services/data.service';
import {Exercise} from '../../../classes/exercise';
import {FormControl} from '@angular/forms';
import {Storage} from '@ionic/storage';
import {Router} from '@angular/router';
import {DateAdapter, MatDatepickerInputEvent, MatInput, MatFormField, MatFormFieldControl, MatSelect} from '@angular/material';
import {SchnappPassiverWortschatzExercise} from 'src/app/classes/exercises/schnappPassiverWortschatzExercise';

@Component({
    selector: 'app-result-view',
    templateUrl: './result-view.page.html',
    styleUrls: ['./result-view.page.scss'],
})
export class ResultViewPage implements OnInit {
    numberArray: Array<number> = new Array<number>();
    letterArray: Array<string> = new Array<string>();
    lastExerciseThatWasntFinished = -1;
    /* aoAnswer = 'null';
    spfAnswer = 'null';
    currentlyPreschoolAnswer = 'null';
    alreadyPreschoolAnswer = 'null';
    public dyslexia_mother = '';
    public dyslexia_father = '';
    public dyslexia_sibling = '';
    public dyslexia_grandParent = '';
    public dyslexia_otherRelatives = ''; */
    index = -1;
    wordsArray = [
        'Banane.png',
        'Buch.png',
        'Kind.png',
        'Limonade.png',
        'Maler.png',
        'Nuss.png',
        'Regen.png',
        'Salami.png',
        'Schere.png',
        'Wolke.png'
    ];
    sentencesArray = [
        'Der Clown fotografiert der Bauer gerne.',
        'Der Affe wird von dem großen Cowboy geärgert.',
        'Der Löwe sieht den Raben, den er gerne mag.',
        'Der Polizist jagt die Hexe und die Hexe weint.',
        'Der Prinz hat die Prinzessin besucht.',
        'Der Prinz will, dass der Bäcker die Hummeln jagt',
        'Die Cowboys finden die Pferde.',
        'Die Hexen machen die Tasche auf.',
        'Die Lehrerin möchte lieber die Kinder malen.',
        'Die Wikinger zeigten den Helm.',
        'Die rote Tomate wird alt.',
        'Ich sehe den Clown, der den Kakadu streichelt',
        'Ich sehe den Raben, den der Pinguin weckt.',
        'Welchen Bauern ärgert der Opa?',
        'Wen umarmt die Rakete heute?'
    ];
    languages: LanguageSelect [] = [
        {value: 'german', viewValue: 'Deutsch', speakingnumber: 300000},
        {value: 'turkish', viewValue: 'Türkisch', speakingnumber: 183445},
        {value: 'serbian', viewValue: 'Serbisch', speakingnumber: 177320},
        {value: 'croatian', viewValue: 'Kroatisch', speakingnumber: 131307},
        {value: 'english', viewValue: 'Englisch', speakingnumber: 58582},
        {value: 'bosnian', viewValue: 'Bosnisch', speakingnumber: 34857},
        {value: 'polish', viewValue: 'Polnisch', speakingnumber: 30598},
        {value: 'albanian', viewValue: 'Albanisch', speakingnumber: 28212},
        {value: 'italian', viewValue: 'Italienisch', speakingnumber: 10742},
        {value: 'french', viewValue: 'Französisch', speakingnumber: 10190},
        {value: 'macedonian', viewValue: 'Mazedonisch', speakingnumber: 5145},
        {value: 'greek', viewValue: 'Griechisch', speakingnumber: 3098},
        {value: 'kurdish', viewValue: 'Kurdisch', speakingnumber: 2133},
        {value: 'hungarian', viewValue: 'Ungarisch', speakingnumber: 40583},
        {value: 'slovenian', viewValue: 'Slowenisch', speakingnumber: 24855},
        {value: 'burgenland_croatian', viewValue: 'Burgenlandkroatisch', speakingnumber: 19412},
        {value: 'czech', viewValue: 'Tschechisch', speakingnumber: 17742},
        {value: 'slovakian', viewValue: 'Slowakisch', speakingnumber: 10234},
        {value: 'romani', viewValue: 'Romänisch', speakingnumber: 6273},
        {value: 'persian', viewValue: 'Persisch', speakingnumber: 1},
        {value: 'arabic', viewValue: 'Arabisch', speakingnumber: 0},
        {value: 'chechen', viewValue: 'Tschetschenisch', speakingnumber: 0},
        {value: 'russian', viewValue: 'Russisch', speakingnumber: 0},
        {value: 'others', viewValue: 'Sonstige', speakingnumber: 0}
    ];
    @Input() result: Result;

    constructor(
        private modalController: ModalController,
        private adapter: DateAdapter<any>,
        public dataService: DataService,
        private router: Router,
        private storage: Storage,
        private alertController: AlertController,
    ) {
    }

    birthdateControl: FormControl;

    ngOnInit() {
        this.index = this.dataService.remainingResults
            .findIndex(value => 
                value.student.name === this.result.student.name && 
                value.testingDate === this.result.testingDate);
        this.adapter.setLocale('aut');
        //this.birthdateControl = new FormControl(this.result.student.birthDate);

        // tslint:disable-next-line:no-shadowed-variable
        /* this.languages.sort((a, b) => {
            if (a.value === 'german' || b.value === 'german') {
                return a.speakingnumber;
            } else {
                return a.viewValue.localeCompare((<string>b.viewValue));
            }
        }); */
        for (let i = 0; i < 20; i++) {
            this.numberArray.push(i);
        }
        let i = 'A'.charCodeAt(0), j = 'Z'.charCodeAt(0);
        for (; i <= j; ++i) {
            this.letterArray.push(String.fromCharCode(i));
        }

        for (const exercise of this.result.results) {
            if (!exercise.finished) {
                this.lastExerciseThatWasntFinished = exercise.number;
                break;
            }
        }
        /* this.aoAnswer = this.result.student.ao ? 'yes' : 'no';
        this.spfAnswer = this.result.student.spf ? 'yes' : 'no';
        this.dyslexia_mother = this.result.student.dyslexiaMother ? 'yes' : 'no';
        this.dyslexia_father = this.result.student.dyslexiaFather ? 'yes' : 'no';
        this.dyslexia_sibling = this.result.student.dyslexiaSibling ? 'yes' : 'no';
        this.dyslexia_grandParent = this.result.student.dyslexiaGrandparent ? 'yes' : 'no';
        this.dyslexia_otherRelatives = this.result.student.dyslexiaOtherRelatives ? 'yes' : 'no';
        this.alreadyPreschoolAnswer = this.result.student.alreadyPreschool ? 'yes' : 'no';
        this.currentlyPreschoolAnswer = this.result.student.currentlyPreschool ? 'yes' : 'no'; */
    }

    async onSave() {
        if (this.result.results.length == 1) {         //Check if it is a GRAWO test and set correct sumCorrect
            var exercise = this.result.results[0] as SchnappPassiverWortschatzExercise;
            var count = 0;
            exercise.answers.forEach(answer => {
                if (answer.correct == 'Richtig') {
                    count++;
                }
            });
            exercise.sumCorrect = count;
        }
        /* this.result.student.dyslexiaSibling = this.dyslexia_sibling === 'yes';
        this.result.student.dyslexiaGrandparent = this.dyslexia_grandParent === 'yes';
        this.result.student.dyslexiaMother = this.dyslexia_mother === 'yes';
        this.result.student.dyslexiaFather = this.dyslexia_father === 'yes';
        this.result.student.dyslexiaOtherRelatives = this.dyslexia_otherRelatives === 'yes';
        this.result.student.germanFirstLanguage = this.result.student.nativeLanguage.toLowerCase() === 'german';
        this.result.student.spf = this.spfAnswer === 'yes';
        this.result.student.ao = this.aoAnswer === 'yes';
        this.result.student.currentlyPreschool = this.currentlyPreschoolAnswer === 'yes';
        this.result.student.alreadyPreschool = this.alreadyPreschoolAnswer === 'yes'; */
        this.result.student.dyslexiaSibling = false;
        this.result.student.dyslexiaGrandparent = false;
        this.result.student.dyslexiaMother = false;
        this.result.student.dyslexiaFather = false;
        this.result.student.dyslexiaOtherRelatives = false;
        this.result.student.germanFirstLanguage = true;
        this.result.student.spf = false;
        this.result.student.ao = false;
        this.result.student.currentlyPreschool = false;
        this.result.student.alreadyPreschool = false;

 
        this.dataService.remainingResults.splice(this.index, 1, this.result);
        await this.storage.set(this.dataService.keyRemainingResult, JSON.stringify(this.dataService.remainingResults));
        this.modalController.dismiss();
    }

    onCancel() {
        this.modalController.dismiss();
    }

    async jumpToExercise(exercise: Exercise) {
        await this.modalController.dismiss(); 
        this.dataService.continueResult(this.result);  // TODO Marcel
    }

    async onDelete() {
        const alert = await this.alertController.create({
            header: 'Wirklich löschen?',
            message: 'Wollen Sie wirklich ' + this.result.student.name + '\'s Testung aus der Liste löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                {
                    text: 'Löschen',
                    handler: async () => {
                        this.dataService.removeResult(this.result);
                        await this.alertController.dismiss();
                        await this.modalController.dismiss();
                    }
                }],
            backdropDismiss: true
        });
        await alert.present();
    }

    canUpload(){
        var test = this.dataService.testSets.find(t => t.id === this.result.testTemplateId);
        //console.log(test);
        if(this.dataService.isUrlSet && test !== undefined){
            return true;
        }
        return false;
    }

    async onSend(){
        const alert = await this.alertController.create({
            header: 'Wirklich erneut hochladen?',
            message: 'Wollen Sie wirklich ' + this.result.student.name + '\'s Testung erneut hochladen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: async () => {
                        await this.alertController.dismiss();
                    }
                },
                {
                    text: 'Hochladen',
                    handler: async () => {
                        this.dataService.sendResult(this.result);
                        await this.alertController.dismiss();
                        await this.modalController.dismiss();
                    }
                }],
            backdropDismiss: true
        });
        await alert.present();
    }


    setNewBirthdate(event: MatDatepickerInputEvent<Date>) {
        this.result.student.birthDate = event.value;
    }

    async onSpf(yes: boolean) {
        if (yes) {
            // if (this.note.length !== 0) {
            //     if (this.note.includes('Körperbehinderung')) {
            //         this.note = this.note.replace('Körperbehinderung', '');
            //     }
            //     if (this.note.includes('Sinnesbeeinträchtigung')) {
            //         this.note = this.note.replace('Sinnesbeeinträchtigung', '');
            //     }
            //     if (this.note.includes('Kognitive / Lernbeeinträchtigung')) {
            //         this.note = this.note.replace('Kognitive / Lernbeeinträchtigung', '');
            //     }
            // }
            // this.note = this.note.trim();

            const alert = await this.alertController.create({
                cssClass: 'spf-alert',
                backdropDismiss: false,
                header: 'SPF Auswahlliste',
                inputs: [
                    {
                        name: 'physicalDisabilityCheckbox',
                        type: 'radio',
                        label: 'Körperbehinderung?',
                        checked: this.result.student.spfNote.includes('Körperbehinderung'),
                        handler: input => {
                            this.result.student.spfNote = '';
                            if (input.checked) {
                                this.result.student.spfNote += 'Körperbehinderung';
                            }
                        }
                    },
                    {
                        name: 'senseImpairmenCheckbox',
                        type: 'radio',
                        label: 'Sinnesbeeinträchtigung (Hören, Sehen)?',
                        checked: this.result.student.spfNote.includes('Sinnesbeeinträchtigung'),
                        handler: input => {
                            this.result.student.spfNote = '';
                            if (input.checked) {
                                this.result.student.spfNote += 'Sinnesbeeinträchtigung';
                            }
                        }
                    },
                    {
                        name: 'cognitive-learningImpairmentCheckbox',
                        type: 'radio',
                        label: 'Kognitive / Lernbeeinträchtigung?',
                        checked: this.result.student.spfNote.includes('Kognitive / Lernbeeinträchtigung'),
                        handler: input => {
                            this.result.student.spfNote = '';
                            if (input.checked) {
                                this.result.student.spfNote += 'Kognitive / Lernbeeinträchtigung';
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        role: 'cancel',
                        text: 'Abbrechen',
                        handler: async () => {
                            if (this.result.student.spfNote.includes('Körperbehinderung')) {
                                this.result.student.spfNote = this.result.student.spfNote.replace('Körperbehinderung', '');
                            }
                            if (this.result.student.spfNote.includes('Sinnesbeeinträchtigung')) {
                                this.result.student.spfNote = this.result.student.spfNote.replace('Sinnesbeeinträchtigung', '');
                            }
                            if (this.result.student.spfNote.includes('Kognitive / Lernbeeinträchtigung')) {
                                this.result.student.spfNote = this.result.student.spfNote.replace('Kognitive / Lernbeeinträchtigung', '');
                            }
                            this.result.student.spfNote = this.result.student.spfNote.trim();
                            await this.alertController.dismiss();
                        }
                    },
                    {
                        text: 'Ok',
                        handler: async () => {
                            this.result.student.spfNote = this.result.student.spfNote.trim();
                            await this.alertController.dismiss();
                        }
                    }
                ]
            });
            await alert.present();
        } else {
            this.result.student.spfNote = '';
        }
    }

    jumpToEvaluation(result: Result) {
        this.dataService.result = result;
        this.modalController.dismiss();
        this.router.navigate(['lv-schreiben-evaluation'], {fragment: 'home'});
    }

    isSended(){
        console.log(this.dataService.indexIsSended);
        console.log(this.dataService.remainingResults);
        return this.dataService.remainingResults[this.dataService.indexIsSended].sendedResult;
    }
}


export interface LanguageSelect {
    value: String;
    viewValue: String;
    speakingnumber: number;
}


