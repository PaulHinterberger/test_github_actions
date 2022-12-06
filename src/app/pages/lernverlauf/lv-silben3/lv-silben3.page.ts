import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {SilbenConfig} from '../../../classes/config/SilbenConfig';
import {LvSilbenExercise} from 'src/app/classes/exercises/lvSilbenExercise';
import {DebugModeComponent} from 'src/app/common-components/debug-mode/debug-mode.component';
import {AppConfig} from '../../../classes/config/AppConfig';
import {SilbenF3Config} from '../../../classes/config/SilbenF3Config';

@Component({
    selector: 'app-lv-silben3',
    templateUrl: './lv-silben3.page.html',
    styleUrls: ['./lv-silben3.page.scss'],
})
export class LvSilben3Page implements OnInit {

    constructor(public router: Router,
                public data: DataService,
                public smartAudio: SmartAudioService,
    ) {
    }
    exercise = new LvSilbenExercise();
    debugMode = new DebugModeComponent();
    tutorialEndCount = 3;
    exerciseIsSkipped: boolean;
    tutorialEnd = false;
    tutorialCount = -1;
    tutorialTimer = null;
    correctAnswerCount = 0;
    wrongAnswerCountInARow = 0;

    selectedAnswer = 0;
    checkBoxColor = ['', '', ''];
    navigateToNextPage = false;
    currentItem = -1;
    headline = 'Übung';

    secondsPassed = 0;

    tutorialItems: Array<SilbenF3Config> = [
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-GR-kl.png',
            'assets/lernverlauf/01-silben/tomate.png',
            'assets/lernverlauf/01-silben/wange.png',
            'assets/lernverlauf/01-silben/kleid.png'
        ], 2, '21')
    ];

    exerciseItems: Array<SilbenF3Config> = [
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-GR-kl.png',
            'assets/lernverlauf/01-silben/stiefel.png',
            'assets/lernverlauf/01-silben/buch.png',
            'assets/lernverlauf/01-silben/regal.png'
        ], 1, '21'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-kl-GR.png',
            'assets/lernverlauf/01-silben/nase.png',
            'assets/lernverlauf/01-silben/bandit.png',
            'assets/lernverlauf/01-silben/schwein.png'
        ], 2, '12'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-GR-kl.png',
            'assets/lernverlauf/01-silben/salat.png',
            'assets/lernverlauf/01-silben/stirn.png',
            'assets/lernverlauf/01-silben/monster.png'
        ], 3, '21'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-kl-GR-kl.png',
            'assets/lernverlauf/01-silben/trompete.png',
            'assets/lernverlauf/01-silben/kapitaen.png',
            'assets/lernverlauf/01-silben/turm.png'
        ], 1, '121'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-GR-kl.png',
            'assets/lernverlauf/01-silben/zylinder.png',
            'assets/lernverlauf/01-silben/garten.png',
            'assets/lernverlauf/01-silben/fernseher.png'
        ], 2, '21'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-kl-GR.png',
            'assets/lernverlauf/01-silben/gebiss.png',
            'assets/lernverlauf/01-silben/schere.png',
            'assets/lernverlauf/01-silben/zirkus.png'
        ], 1, '12'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-kl-GR-kl.png',
            'assets/lernverlauf/01-silben/zauberstab.png',
            'assets/lernverlauf/01-silben/kiwi.png',
            'assets/lernverlauf/01-silben/laterne.png'
        ], 3, '121'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-GR-kl.png',
            'assets/lernverlauf/01-silben/baum.png',
            'assets/lernverlauf/01-silben/pinsel.png',
            'assets/lernverlauf/01-silben/pokal.png'
        ], 2, '21'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-kl-GR.png',
            'assets/lernverlauf/01-silben/stapel.png',
            'assets/lernverlauf/01-silben/schiff.png',
            'assets/lernverlauf/01-silben/karton.png'
        ], 3, '12'),
        new SilbenF3Config(['assets/lernverlauf/01-silben/steine-GR-kl.png',
            'assets/lernverlauf/01-silben/sterne.png',
            'assets/lernverlauf/01-silben/delphin.png',
            'assets/lernverlauf/01-silben/gemuese.png'
        ], 1, '21')
    ];

    ngOnInit() {
        this.exercise.route = 'lv-silben3';
        this.data.setExerciseProperties(this.exercise);
        this.smartAudio.sounds = []; // fix for wrong audio preload
        this.initAudios();
        //  this.smartAudio.play('tutorial');
        this.startTimer();

    }

    initAudios() {
        // Intros
        this.smartAudio.preload('tutorial', 'assets/lernverlauf/audios/L1_Silben/File_59_Rhythmus_findet_Wort_Instruktion_1.mp3');
        this.smartAudio.preload('tutorial1', 'assets/lernverlauf/audios/L1_Silben/File_60_Rhythmus_findet_Wort_Instruktion_2.mp3');
        this.smartAudio.preload('tutorial2', 'assets/lernverlauf/audios/L1_Silben/File_61_Rhythmus_findet_Wort_Instruktion_3.mp3');
        // 49-59
        for (let index = 0; index < 11; index++) {
            this.smartAudio.preload('audio' + index, 'assets/lernverlauf/audios/L1_Silben/F3_B_' + (index + 49) + '.mp3');
        }

        this.smartAudio.preload('klang', 'assets/lernverlauf/audios/L1_Silben/Klang.mp3');
        this.smartAudio.preload('kling', 'assets/lernverlauf/audios/L1_Silben/Kling.mp3');
        this.smartAudio.preload('silben12', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_2.mp3');
        this.smartAudio.preload('silben21', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_2.mp3');
        this.smartAudio.preload('silben11', 'assets/lernverlauf/audios/L1_Silben/Kling_Kling_2.mp3');
        this.smartAudio.preload('silben22', 'assets/lernverlauf/audios/L1_Silben/Klang_Klang_2.mp3');
              
        this.smartAudio.preload('silben111', 'assets/lernverlauf/audios/L1_Silben/Klang_Klang_Klang_2.mp3');
        this.smartAudio.preload('silben112', 'assets/lernverlauf/audios/L1_Silben/Klang_Klang_Kling_2.mp3');
        this.smartAudio.preload('silben121', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_Klang_2.mp3');
        this.smartAudio.preload('silben122', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_Kling_2.mp3');
        this.smartAudio.preload('silben211', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_Klang_2.mp3');
        this.smartAudio.preload('silben212', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_Kling_2.mp3');
        this.smartAudio.preload('silben221', 'assets/lernverlauf/audios/L1_Silben/Kling_Kling_Klang_2.mp3');
        this.smartAudio.preload('silben222', 'assets/lernverlauf/audios/L1_Silben/Kling_Kling_Kling_2.mp3');

    }

    nextPage() {
        this.exercise.finished = true;
        this.exercise.correct = this.correctAnswerCount === 5;
        if (this.data.result !== undefined) {
            this.data.result.results.push(this.exercise);
            this.data.saveResult(false);
        }
        this.smartAudio.stop;
        this.smartAudio.audioPlayer.removeEventListener;
        this.stopTimer();
        this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
    }

    startExercise() {
        this.smartAudio.audioPlayer.pause();
        // this.pause();
        this.smartAudio.stop;
        this.stopTimer();
        this.tutorialEnd = true;
        // this.stopTimer();
        this.tutorialCount = 3;
        this.currentItem++;

        this.playAudio(0);
        this.navigateToNextPage = false;
        this.headline = 'Durchgang ' + (this.currentItem + 1);
        this.initCheckBoxColors();
    }

    skipExercise() {
        this.smartAudio.audioPlayer.pause();
        this.exerciseIsSkipped = true;
        // this.startDebugMode();
        this.nextPage();
    }

    initCheckBoxColors() {
        this.checkBoxColor = ['', '', ''];
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
        this.checkBoxColor[correctIndex - 1] = 'borderCorrected';
        this.navigateToNextPage = true;
        this.smartAudio.play('tutorial2');
    }

    selectAnswer(answer: number) {
        this.initCheckBoxColors();
        this.selectedAnswer = answer;
        this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
        this.navigateToNextPage = true;
    }

    nextItem() {
        const correctIndex = this.exerciseItems[this.currentItem].correctIndex;
        if ((correctIndex) === (this.selectedAnswer + 1)) {
            this.correctAnswerCount++;
            console.log('richtig');
            this.wrongAnswerCountInARow = 0;

        } else {
            this.wrongAnswerCountInARow++;
            console.log('falsch');
        }
        this.selectedAnswer = -1;
        if ((this.currentItem + 1) === this.exerciseItems.length || this.correctAnswerCount === 5 || this.wrongAnswerCountInARow === 5) {
            this.nextPage();
        } else {
            this.currentItem++;
            this.playAudio(0);
            this.navigateToNextPage = false;
            this.headline = 'Durchgang ' + (this.currentItem + 1);
            this.initCheckBoxColors();
        }
    }

    getPlayIcon(): string {
        return this.data.isAudioPlaying ? 'pause' : 'volume-high';
    }

    playAudio(buttonId = 0) {
        // console.log('play Audio buttonId ' + buttonId + ' wordCount: ' + this.wordCount + ' currentItem: ' + this.currentItem);
        // console.log(this.exerciseItems[this.currentItem].correctSilben);
        this.initCheckBoxColors();
        this.navigateToNextPage = false;
        switch(buttonId){
            case 0: {
                this.smartAudio.play('silben' + this.exerciseItems[this.currentItem].correctSilben);
                setTimeout(val => {
                    this.smartAudio.play('audio' + (this.currentItem + 1));
                }, 3500);
                break;
            }
            case 1: this.smartAudio.play('silben' + this.exerciseItems[this.currentItem].correctSilben); break;
            case 2: this.smartAudio.play('audio' + (this.currentItem + 1)); break;
        }
      }

    tutorialPictureTrigger() {
        // console.log(this.secondsPassed); 
        switch(this.secondsPassed){
            case 1: this.smartAudio.play('tutorial'); break;
            case 9: this.smartAudio.play('silben21'); break;
            case 11: this.tutorialCount = 2; break;
            case 12: this.smartAudio.play('tutorial1'); this.stopTimer(); break;
        }       
    }

    redoButton() {
        this.tutorialCount = -1;
        this.initCheckBoxColors();
        this.headline = "Übung";
        this.currentItem = -1;
        this.navigateToNextPage = false;
        this.stopTimer();
        this.startTimer();
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
            this.secondsPassed = 0;
        }
    }
}
