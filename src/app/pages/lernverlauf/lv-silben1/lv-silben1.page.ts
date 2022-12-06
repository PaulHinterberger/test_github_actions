import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {SilbenConfig} from '../../../classes/config/SilbenConfig';
import {LvSilbenExercise} from 'src/app/classes/exercises/lvSilbenExercise';
import {DebugModeComponent} from 'src/app/common-components/debug-mode/debug-mode.component';
import {HttpClient} from '@angular/common/http';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
    selector: 'app-lv-silben1',
    templateUrl: './lv-silben1.page.html',
    styleUrls: ['./lv-silben1.page.scss'],
})
export class LvSilben1Page implements OnInit {
    // Steine: 2 = Kling, 1 = Klang, 0 = empty
    mainWord: SilbenConfig;
    wordCount = 0;
    compareWords: Array<SilbenConfig>;
    tutorialCount = 0;
    tutorialEndCount = 9;
    correctAnswerCount = 0;
    wrongAnswerCountInARow = 0;
    elapsedSeconds = 0;
    tutorialTimer = null;
    disableTut = false;
    togglePause = false;
    debugMode = new DebugModeComponent();
    exercise = new LvSilbenExercise();

    constructor(public router: Router,
                public data: DataService,
                public smartAudio: SmartAudioService,
                public sourceLoader: HttpClient
    ) {
    }

    async initAudios() {
        this.smartAudio.preload('f1-intro0', 'assets/lernverlauf/audios/L1_Silben/F1_B_14.mp3');     // intro links
        this.smartAudio.preload('f1-intro1', 'assets/lernverlauf/audios/L1_Silben/F1_B_15.mp3');     // intro rechts
        this.smartAudio.preload('f1-introEx', 'assets/lernverlauf/audios/L1_Silben/File_25_Zweisilber_einfach_Beispiel_0.mp3'); // preload audio for introduction

        this.smartAudio.preload('silben12', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_2.mp3');
        this.smartAudio.preload('silben21', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_2.mp3');

        this.smartAudio.preload('f1-tut-salat', 'assets/lernverlauf/audios/L1_Silben/File_17_Zweisilber_einfach_Instruktion_1.mp3');
        this.smartAudio.preload('f1-tut-salat-steine', 'assets/lernverlauf/audios/L1_Silben/File_19_Zweisilber_einfach_Instruktion_3.mp3');
        this.smartAudio.preload('f1-tut-stiefel', 'assets/lernverlauf/audios/L1_Silben/File_20_Zweisilber_einfach_Instruktion_4.mp3');
        this.smartAudio.preload('f1-tut-stiefel-steine', 'assets/lernverlauf/audios/L1_Silben/File_22_Zweisilber_einfach_Instruktion_6.mp3');
        this.smartAudio.preload('f1-tut-hase', 'assets/lernverlauf/audios/L1_Silben/File_23_Zweisilber_einfach_Instruktion_7.mp3');
        this.smartAudio.preload('f1-tut-hase-steine', 'assets/lernverlauf/audios/L1_Silben/File_24_Zweisilber_einfach_Instruktion_8.mp3');
        this.smartAudio.preload('f1-tut-kreuz', 'assets/lernverlauf/audios/L1_Silben/File_24_Zweisilber_einfach_Instruktion_9.mp3');
    }

    initExercise() {
        this.mainWord = new SilbenConfig('assets/lernverlauf/01-silben/hase.png', 'Hase', '210');
        this.sourceLoader.get('assets/lernverlauf/01-silben/silben1-item-config.csv', {responseType: 'text'})
            .subscribe(data => {
                const exerciseConfig = data.split('\n');
                var mainWordItems = exerciseConfig.shift().split(';')   //First item of item-config is main item
                this.mainWord = new SilbenConfig('assets/lernverlauf/01-silben/' + mainWordItems[0],
                    mainWordItems[1],
                    mainWordItems[2]
                );
                this.smartAudio.preload('f1-left', 'assets/lernverlauf/audios/L1_Silben/' + mainWordItems[3]);  // Left side(Main word)
                var compareWordsSplitted = exerciseConfig
                    .map(item => item.split(';'));
                for (let index = 0; index < compareWordsSplitted.length; index++) {
                    this.smartAudio.preload('f1-audio' + (index + 1), 'assets/lernverlauf/audios/L1_Silben/' + compareWordsSplitted[index][3]);        // alle Audios für rechte Seite
                }
                this.compareWords = compareWordsSplitted
                    .map(item => new SilbenConfig(
                        'assets/lernverlauf/01-silben/' + item[0],
                        item[1],
                        item[2]
                    ));
                this.compareWords.unshift(new SilbenConfig('assets/lernverlauf/01-silben/salat.png', 'Salat', '120'));
            });
    }

    ngOnInit() {
        this.exercise.route = 'lv-silben';
        this.data.setExerciseProperties(this.exercise);
        this.initAudios();
        this.startTutorial();
    }

    skipTutorial() {
        this.smartAudio.audioPlayer.pause();
        clearInterval(this.tutorialTimer);
        this.tutorialCount = this.tutorialEndCount;
        this.startExercise();
    }

    skipExercise() {
        this.smartAudio.audioPlayer.pause();
        clearInterval(this.tutorialTimer);
        this.nextPage();
    }

    startTutorial() {
        this.mainWord = new SilbenConfig('assets/lernverlauf/01-silben/salat.png', 'Salat', '120');
        this.compareWords = [new SilbenConfig('assets/lernverlauf/01-silben/stiefel.png', 'Stiefel', '210')];
        this.tutorialCount = 0;
        this.elapsedSeconds = 0;
        this.startTimer();
    }

    // Timer Funktion start
    startTimer() {
        this.tutorialTimer = setInterval(v => {
            this.elapsedSeconds++;
            this.triggerNextTutorial();
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

    redoButton() {
        this.stopTimer();
        this.togglePause = false;
        this.tutorialCount = 0;
        this.disableTut = false;
        this.startTutorial();
    }


    triggerNextTutorial() {
        // console.log(this.elapsedSeconds);
        switch (this.elapsedSeconds) {
            case 1:
                this.smartAudio.play('f1-tut-salat');
                break;
            case 12:
                this.smartAudio.play('silben12');
                break;
            case 16:
                this.smartAudio.play('f1-tut-salat-steine');
                break;
            // kleiner Stein taucht auf
            case 20:
                ++this.tutorialCount;
                break;
            // großer Stein taucht auf
            case 22:
                ++this.tutorialCount;
                break;
            // Steine verschwinden wieder
            case 25:
                this.tutorialCount -= 2;
                break;
            // Audio + kleiner Stein
            case 28:
                this.smartAudio.play('silben12');
                ++this.tutorialCount;
                break;
            // großer Stein
            case 29:
                ++this.tutorialCount;
                break;
            // PAUSE
            case 31:
                this.pause();
                break;

            case 32:
                this.smartAudio.play('f1-tut-stiefel');
                break;
            // Bild Stiefel
            case 34:
                ++this.tutorialCount;
                break;
            case 40:
                this.smartAudio.play('silben21');
                break;
            case 44:
                this.smartAudio.play('f1-tut-stiefel-steine');
                break;
            // großer Stein
            case 47:
                ++this.tutorialCount;
                break;
            // kleiner Stein
            case 49:
                ++this.tutorialCount;
                break;
            // Steine wieder weg
            case 52:
                this.tutorialCount -= 2;
                break;
            // großer Stein + KlingKlang
            case 56:
                ++this.tutorialCount;
                this.smartAudio.play('silben21');
                break;
            // kleiner Stein
            case 57:
                ++this.tutorialCount;
                break;
            // Pause
            case 60:
                this.pause();
                break;

            // Wechsel auf Hase + Salat
            case 61:
                this.initExercise();
                this.disableTut = true;
                ++this.tutorialCount;
                this.smartAudio.play('f1-tut-hase');
                break;
            case 69:
                this.smartAudio.play('silben21');
                break;
            case 72:
                ++this.tutorialCount;
                this.smartAudio.play('f1-tut-hase-steine');
                break;
            // Ende Tutorial, Weiter mit auf Kreuz tippen
            case 94:
                this.smartAudio.play('f1-tut-kreuz');
                this.stopTimer();
                break;

            default:
                break;

        }
    }

    startExercise() {
        // console.log("Start exercise called")
        this.initExercise();
        this.disableTut = true;
        this.tutorialCount = 9;
        this.wrongAnswerCountInARow = 0;
        this.correctAnswerCount = 0;
        this.wordCount = 1;
        this.smartAudio.play('f1-introEx');
        setTimeout(() => {
            this.playExerciseAudio();
        }, 5000);
    }

    compare(same: boolean) {

        if (this.wordCount === 0) {
            this.startExercise();
            return;
        }
        if ((this.mainWord.silben === this.compareWords[this.wordCount].silben) === same) {
            console.log('richtig');
            this.correctAnswerCount++;
            this.wrongAnswerCountInARow = 0;
        } else {
            console.log('falsch');
            this.wrongAnswerCountInARow++;
        }
        if (this.correctAnswerCount === 5 || this.wrongAnswerCountInARow === 5) {
            console.log('F1 nach insgesamt 5 richtigen oder 5 falschen hintereinander abgebrochen.');
            this.nextPage();
            return;
        }
        if (this.wordCount + 1 === this.compareWords.length) {
            console.log('F1 alle Items abgeschlossen.');
            this.nextPage();
            return;
        }
        this.wordCount++;
        this.playExerciseAudio();

    }

// X
    nextPage() {
        this.exercise.finished = true;
        this.exercise.correct = this.correctAnswerCount === 5 ? true : false;        
        if (this.data.result !== undefined) {
            this.data.result.results.push(this.exercise);
            // console.log(this.data.result);
            this.data.saveResult(false);
        }
        this.smartAudio.stop;
        this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
    }

    getPlayIcon(): string {
        return this.data.isAudioPlaying ? 'pause' : 'volume-high';
    }

    getStoneImage(word: SilbenConfig, i: number): string {
        if (word.silben[i] === '1') {
            return 'assets/lernverlauf/01-silben/stoneSmall.png';
        }
        if (word.silben[i] === '2') {
            return 'assets/lernverlauf/01-silben/stoneBig.png';
        }
    }

    playExerciseAudio(i = 0) {              // 0 === right, 1 === left
        const id = (i === 0) ? 'f1-audio' + this.wordCount : 'f1-left';

        this.data.isAudioPlaying ? this.smartAudio.stop(id) : this.smartAudio.play(id);
        // this.data.isAudioPlaying = !this.data.isAudioPlaying;
    }
}
