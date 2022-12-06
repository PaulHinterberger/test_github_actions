import {Component, OnInit} from '@angular/core';
import {SmartAudioService} from '../../../services/smart-audio.service';
import {DataService} from '../../../services/data.service';
import {Router} from '@angular/router';
import {LvSilbenExercise} from '../../../classes/exercises/lvSilbenExercise';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';
import {AppConfig} from '../../../classes/config/AppConfig';
import {SilbenF2Config} from '../../../classes/config/SilbenF2Config';

@Component({
    selector: 'app-lv-silben2',
    templateUrl: './lv-silben2.page.html',
    styleUrls: ['./lv-silben2.page.scss'],
})
export class LvSilben2Page implements OnInit {
    // timer

    constructor(public router: Router,
                public data: DataService,
                public smartAudio: SmartAudioService,
    ) {
    }

    headline = 'Übung';
    tutorialCount = 0;
    tutorialEndCount = 3;
    currentItem = -1;
    selectedAnswer = -1;
    correctAnswerCount = 0;
    wrongAnswerCountInARow = 0;
    navigateToNextPage = false;
    checkBoxColor = ['', '', ''];
    secondsPassed = 0;
    tutorialTimer = null;
    togglePause = false;
    audioCnt = 1;
    debugMode = new DebugModeComponent();
    exercise = new LvSilbenExercise();
    tutorialItems: Array<SilbenF2Config> = [
        new SilbenF2Config(['assets/lernverlauf/01-silben/salat.png',
            'assets/lernverlauf/01-silben/regen.png',
            'assets/lernverlauf/01-silben/gesicht.png',
            'assets/lernverlauf/01-silben/kleid.png'
        ], 2, '12')
    ];

    exerciseItems: Array<SilbenF2Config> = [
        new SilbenF2Config(['assets/lernverlauf/01-silben/beule.png',
            'assets/lernverlauf/01-silben/bett.png',
            'assets/lernverlauf/01-silben/steine.png',
            'assets/lernverlauf/01-silben/schultuete.png'
        ], 2, '21'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/pokal.png',
            'assets/lernverlauf/01-silben/tisch.png',
            'assets/lernverlauf/01-silben/engel.png',
            'assets/lernverlauf/01-silben/delphin.png'
        ], 3, '12'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/polizei.png',
            'assets/lernverlauf/01-silben/lehrer.png',
            'assets/lernverlauf/01-silben/salate.png',
            'assets/lernverlauf/01-silben/astronaut.png'
        ], 3, '112'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/banane.png',
            'assets/lernverlauf/01-silben/ast.png',
            'assets/lernverlauf/01-silben/ameise.png',
            'assets/lernverlauf/01-silben/gemuese.png'
        ], 3, '121'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/riese.png',
            'assets/lernverlauf/01-silben/gebiss.png',
            'assets/lernverlauf/01-silben/insel.png',
            'assets/lernverlauf/01-silben/pinguin.png'
        ], 2, '21'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/tafel.png',
            'assets/lernverlauf/01-silben/becher.png',
            'assets/lernverlauf/01-silben/kamin.png',
            'assets/lernverlauf/01-silben/arm.png'
        ], 1, '21'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/kamel.png',
            'assets/lernverlauf/01-silben/paket.png',
            'assets/lernverlauf/01-silben/haus.png',
            'assets/lernverlauf/01-silben/spiegel.png'
        ], 1, '12'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/kartoffel.png',
            'assets/lernverlauf/01-silben/rakete.png',
            'assets/lernverlauf/01-silben/hund.png',
            'assets/lernverlauf/01-silben/teppich.png'
        ], 1, '121'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/nagel.png',
            'assets/lernverlauf/01-silben/decke.png',
            'assets/lernverlauf/01-silben/pullover.png',
            'assets/lernverlauf/01-silben/regal.png'
        ], 1, '21'),
        new SilbenF2Config(['assets/lernverlauf/01-silben/bandit.png',
            'assets/lernverlauf/01-silben/eskimo.png',
            'assets/lernverlauf/01-silben/geschenk.png',
            'assets/lernverlauf/01-silben/rucksack.png'
        ], 2, '12')
    ];

    audiosInstructions: Array<string> = [
        'assets/lernverlauf/audios/L1_Silben/File_36_2_u_3-Silber_mehr_Auswahl_Instruktion_1.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_37_2_u_3-Silber_mehr_Auswahl_Instruktion_2.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_38_2_u_3-Silber_mehr_Auswahl_Instruktion_3.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_38_2_u_3-Silber_mehr_Auswahl_Instruktion_4.mp3'
    ];

    audiosFullSentence: Array<string> = [
        'assets/lernverlauf/audios/L1_Silben/F2_C_2.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_3.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_41.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_4.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_5.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_6.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_7.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_8.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_9.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_C_10.mp3'
    ];

    audiosWordLeft: Array<string> = [
        'assets/lernverlauf/audios/L1_Silben/F2_B_29.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_31.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_33.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_35.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_37.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_39.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_41.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_43.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_45.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_47.mp3'
    ];

    audiosWordsRight: Array<string> = [
        'assets/lernverlauf/audios/L1_Silben/F2_B_30.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_32.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_34.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_36.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_38.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_40.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_42.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_44.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_46.mp3',
        'assets/lernverlauf/audios/L1_Silben/F2_B_48.mp3'
    ];

    ngOnInit() {
        this.exercise.route = 'lv-silben2'
        this.data.setExerciseProperties(this.exercise);        
        this.smartAudio.sounds = []; // fix for wrong audio preload
        this.initAudio();
        this.startTimer();
    }

    nextPage() {
        this.initCheckBoxColors();
        this.smartAudio.stop;      
        this.exercise.finished = true;
        this.exercise.correct = this.correctAnswerCount === 5;
        if (this.data.result !== undefined) {
            this.data.result.results.push(this.exercise);
            this.data.saveResult(false);
        }
        this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
    }

    startExercise() {
        this.smartAudio.audioPlayer.pause();
        // this.pause();
        // this.smartAudio.stop;

        this.stopTimer();
        this.currentItem = 0;
        this.tutorialCount = 3;
        this.audioCnt = 2;
        this.playAudio(2);
        this.navigateToNextPage = false;
        this.headline = 'Durchgang ' + (this.currentItem + 1);
        this.initCheckBoxColors();
    }

    skipExercise() {
        this.smartAudio.audioPlayer.pause();
        this.stopTimer();
        this.nextPage();
    }

    async initAudio() {        //  27-48 Files
        let i = 0;
        this.audiosInstructions.forEach(element => {
            this.smartAudio.preload('tutorial' + (i++), element);
        });
        i = 0;
        this.audiosFullSentence.forEach(element => {
            this.smartAudio.preload('fullSentence' + (i++), element);
        });
        i = 0;
        this.audiosWordLeft.forEach(element => {
            this.smartAudio.preload('wordLeft' + (i++), element);
        });
        i = 0;
        this.audiosWordsRight.forEach(element => {
            this.smartAudio.preload('wordsRight' + (i++), element);
        });

        // let cnt = 0;
        // for (let index = 0; index < 20; index += 2) {
        //     this.smartAudio.preload('left' + cnt, 'assets/lernverlauf/audios/L1_Silben/F2_B_' + (index + 29) + '.mp3');
        //     this.smartAudio.preload('right' + cnt, 'assets/lernverlauf/audios/L1_Silben/F2_B_' + (index + 30) + '.mp3');
        //     cnt++;
        // }
        // init Kling, Klang
        // this.smartAudio.preload('klang', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_2.mp3');
        this.smartAudio.preload('klangkling', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_2.mp3');

    }

    getPlayIcon(): string {
        return this.data.isAudioPlaying ? 'pause' : 'volume-high';
    }

    tutorialFinished() {
        return this.tutorialCount === 3;
    }

    playAudio(i = 2) {
        this.initCheckBoxColors();
        this.navigateToNextPage = false;
        if (!this.tutorialFinished()) {
            this.smartAudio.play('tutorial' + this.tutorialCount);
            return;
        }
        switch (i) {
            case 0:
                this.smartAudio.play('wordLeft' + this.currentItem);
                break;
            case 1:
                this.smartAudio.play('wordsRight' + this.currentItem);
                break;
            case 2:
                this.smartAudio.play('fullSentence' + this.currentItem);
                break;
        }
    }

    initCheckBoxColors() {
        this.checkBoxColor = ['', '', ''];
    }

    nextItem() {
        const correctIndex = this.exerciseItems[this.currentItem].correctIndex;
        if (correctIndex === (this.selectedAnswer + 1)) {
            this.correctAnswerCount++;
            console.log('richtig');
            this.wrongAnswerCountInARow = 0;

        } else {
            this.wrongAnswerCountInARow++;
            console.log('falsch');
        }

        this.selectedAnswer = -1;

        if (this.currentItem + 1 === this.exerciseItems.length || this.correctAnswerCount === 5 || this.wrongAnswerCountInARow === 5) {
            this.nextPage();
        } else {
            this.currentItem++;
            this.audioCnt++;
            this.playAudio(2);
            this.navigateToNextPage = false;
            this.headline = 'Durchgang ' + (this.currentItem + 1);
            this.initCheckBoxColors();
        }
    }

    selectTutorialAnswer(answer: number) {
        this.selectedAnswer = answer;
        this.initCheckBoxColors();
        this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
        this.navigateToNextPage = false;
        setTimeout(val => {
            this.tutorialFeedback();
        }, AppConfig.TimeoutTutorialFeedback);
    }

    tutorialFeedback() {
        const correctIndex = this.tutorialItems[0].correctIndex;
        this.checkBoxColor[(correctIndex) - 1] = 'borderCorrected';
        this.smartAudio.play('tutorial3');
        this.navigateToNextPage = true;
    }

    selectAnswer(answer: number) {
        this.initCheckBoxColors();
        this.selectedAnswer = answer;
        this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
        this.navigateToNextPage = true;
    }

    // Timer Funktion start
    startTimer() {
        this.tutorialTimer = setInterval(v => {
            this.secondsPassed++;
            this.tutorialPictureTrigger();
        }, 1000);
    }

    stopTimer() {
        if (this.tutorialTimer != null) {
            clearInterval(this.tutorialTimer);
        }
    }

    pause() {
        this.togglePause = !this.togglePause;
        if (!this.togglePause) {
            this.startTimer();
        } else {
            this.stopTimer();
        }
    }

    tutorialPictureTrigger() {
        switch (this.secondsPassed) {
            case 1:
                this.playAudio();
                break;
            case 7:
                this.smartAudio.play('klangkling');
                break;
            case 10:
                ++this.tutorialCount;
                this.playAudio();
                break;
            case 14:
                this.smartAudio.play('klangkling');
                break;
            case 17:
                ++this.tutorialCount;
                this.playAudio();
                break;
            case 22:
                this.stopTimer();
                break;
        }
    }

    redoButton() {
        this.audioCnt = 0;
        this.secondsPassed = 0;
        this.tutorialCount = 0;
        this.smartAudio.stop;
        this.headline = 'Übung';
        this.navigateToNextPage = false;
        this.stopTimer();
        this.startTimer();
    }
}
