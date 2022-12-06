import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {SmartAudioService} from '../../../services/smart-audio.service';
import {SilbenConfig} from '../../../classes/config/SilbenConfig';
import {AppConfig} from '../../../classes/config/AppConfig';
import { DebugModeComponent } from '../../../common-components/debug-mode/debug-mode.component';


@Component({
    selector: 'app-lv-silben',
    templateUrl: './lv-silben.page.html',
    styleUrls: ['./lv-silben.page.scss'],
})
export class LvSilbenPage implements OnInit {
    tutorialPictures: Array<SilbenConfig>;
    exercisePictures: Array<SilbenConfig>;
    selectionPictures: Array<SilbenConfig>;
    checkBoxColor: Array<String>;
    currentTutorialItem = 0;
    tutorialEndCount = 7;
    tutorialTimer = null;
    elapsedSeconds = 0;

    exerciseTimer = null;
    currentExerciseItem = 0;
    showStones = false;
    selectedAnswer = -1;
    currentAudioItem: number;

    navigateToNextPage = false;
    currentCorrectItems = 0;
    currentAnswerCorrect = false;
    title = 'Silbenanzahl';    
    debugMode = new DebugModeComponent();

    constructor(public router: Router,
                public data: DataService,
                public smartAudio: SmartAudioService,
    ) {
    }

    ngOnInit() {
        if (this.data.result !== undefined) {
            this.title = this.data.getExerciseByRoute('lv-silben').title;
        }
        this.initTutorialPictures();
        this.initExercisePictures();
        this.preloadAudios();
        this.startTutorial();
    }
    initTutorialPictures() {
        this.tutorialPictures = [
            new SilbenConfig('assets/lernverlauf/01-silben/hut.png', 'hut', '1'),
            new SilbenConfig('assets/lernverlauf/01-silben/salat.png', 'salat', '12'),
            new SilbenConfig('assets/lernverlauf/01-silben/zauberstab.png', 'zauberstab', '211')];
    }

    initExercisePictures() {
        // pictures on the left side
        this.exercisePictures = [
            new SilbenConfig('assets/lernverlauf/01-silben/ritter.png', 'ritter', '2'),
            new SilbenConfig('assets/lernverlauf/01-silben/fenster.png', 'fenster', '2'),
            // you will not see the silben again after the first 2
            new SilbenConfig('assets/lernverlauf/01-silben/hand.png', 'hand', '1'),
            new SilbenConfig('assets/lernverlauf/01-silben/gesicht.png', 'gesicht', '2'),
            new SilbenConfig('assets/lernverlauf/01-silben/roboter.png', 'roboter', '3'),
            new SilbenConfig('assets/lernverlauf/01-silben/schulter.png', 'schulter', '2'),
            new SilbenConfig('assets/lernverlauf/01-silben/frau.png', 'frau', '1'),
            new SilbenConfig('assets/lernverlauf/01-silben/koenigin.png', 'koenigin', '3'),
            new SilbenConfig('assets/lernverlauf/01-silben/geschenk.png', 'geschenk', '2'),
            new SilbenConfig('assets/lernverlauf/01-silben/piraten.png', 'piraten', '3')];

            // pictures on the right side
            this.selectionPictures = [
                new SilbenConfig('assets/lernverlauf/01-silben/steinreihe-1.png', 'steinreihe-1', '1'),
                new SilbenConfig('assets/lernverlauf/01-silben/steinreihe-2.png', 'steinreihe-2', '2'),
                new SilbenConfig('assets/lernverlauf/01-silben/steinreihe-3.png', 'steinreihe-3', '3')];
    }

    preloadAudios() {
        this.smartAudio.preload('f0-hutAudio', 'assets/lernverlauf/audios/L1_Silben/File_4_Silbenanzahl_Instruktion_1.mp3');
        this.smartAudio.preload('f0-salatAudio', 'assets/lernverlauf/audios/L1_Silben/File_5_Silbenanzahl_Instruktion_2.mp3');
        this.smartAudio.preload('f0-zauberstabAudio', 'assets/lernverlauf/audios/L1_Silben/File_6_Silbenanzahl_Instruktion_3.mp3');
        this.smartAudio.preload('f0-introEx', 'assets/lernverlauf/audios/L1_Silben/File_7_Silbenanzahl_Beispiel_1.mp3'); // preload audio for introduction
    }
    skipTutorial() {
        this.smartAudio.audioPlayer.pause();
        this.currentTutorialItem = ++this.tutorialEndCount;
        this.startExercise();
    }
    skipExercise() {
        this.smartAudio.audioPlayer.pause();
        clearInterval(this.tutorialTimer);
        this.router.navigate(['lv-silben1']);
    }


    startTutorial() {
        // this.smartAudio.stop;
        this.currentTutorialItem = 0;
        this.elapsedSeconds = 0;
        this.tutorialTimer = setInterval(v => {
            this.elapsedSeconds++;
            this.tutorialTrigger();
        }, 2000);
    }

    tutorialTrigger() {
        if (this.currentTutorialItem < this.tutorialEndCount) {
            switch (this.elapsedSeconds) {
                case 1:
                    this.smartAudio.play('f0-hutAudio');
                    break;
                case 4:
                    ++this.currentTutorialItem;
                    break;
                case 6:
                    ++this.currentTutorialItem;
                    break;
                case 7:
                    this.smartAudio.play('f0-salatAudio');
                    break;
                case 9:
                    ++this.currentTutorialItem;
                    break;
                case 10:
                    ++this.currentTutorialItem;
                    break;
                case 11:
                    ++this.currentTutorialItem;
                    break;
                case 12:
                    ++this.currentTutorialItem;
                    this.smartAudio.play('f0-zauberstabAudio');
                    break;
                case 15:
                    ++this.currentTutorialItem;
                    break;
                default:
                    break;
            }
            if (this.currentTutorialItem >= this.tutorialEndCount) {
                clearInterval(this.tutorialTimer);
            }
        }
    }

    startExercise() {
        clearInterval(this.tutorialTimer);
        this.currentTutorialItem = this.tutorialEndCount + 1;
        this.currentExerciseItem = 0;
        this.currentAudioItem = 3; // 3 = Start of first Exercise Audio
        this.nextAudio();
        this.exerciseTimer = setTimeout(v => {
            this.showStones = true;
        }, 5000);
    }

    selectAnswer(answer: number) {
        this.selectedAnswer = answer;
        this.initCheckBoxColor();
        this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
        setTimeout(val => {
            this.compareItems();
        }, AppConfig.TimeoutTutorialFeedback);
    }


    initCheckBoxColor() {
        this.checkBoxColor = ['', '', ''];
    }


    nextAudio() {
        this.selectedAnswer = -1;
        this.navigateToNextPage = false;
        this.initCheckBoxColor();

        if (this.currentExerciseItem === 0) {
            this.smartAudio.play('f0-introEx');
        }
        this.currentAudioItem = this.currentAudioItem + 1; 
        this.smartAudio.preload('f0-audio' + this.currentAudioItem, 'assets/lernverlauf/audios/L1_Silben/F0_B_' + this.currentAudioItem + '.mp3');
        if (this.smartAudio.audioPlayer.paused) {
            this.smartAudio.play('f0-audio' + this.currentAudioItem);
        }
    }


    getPlayIcon(): string {
        if (this.currentTutorialItem < this.tutorialEndCount) {
            return 'refresh';
        }
        return this.data.isAudioPlaying ? 'pause' : 'volume-high';
    }

    playAudio() {
        if (this.data.isAudioPlaying) {
            this.smartAudio.stop('f0-audio' + this.currentAudioItem);
        } else {
            this.initCheckBoxColor();
            this.navigateToNextPage = false;
            this.smartAudio.play('f0-audio' + this.currentAudioItem);
        }
    }

    compareItems() {
        const correctAnswer = this.exercisePictures[this.currentExerciseItem];
        const selectedAnswer = this.selectionPictures[this.selectedAnswer];
        this.checkBoxColor[parseInt(correctAnswer.silben) - 1] = 'borderCorrected';
        this.currentAnswerCorrect = correctAnswer.silben === selectedAnswer.silben;
        this.navigateToNextPage = true;
    }

    nextPage() {
        if (this.currentAnswerCorrect) {
            this.currentCorrectItems++;
        } else {
            this.currentCorrectItems = 0;
        }
        if (this.currentCorrectItems === 5) {
            // console.log('5 richtige Antworten => weiter zu Silben F1');
            this.router.navigate(['lv-silben1']);
            return;
        }
        this.currentExerciseItem++;
        if (this.currentExerciseItem === this.exercisePictures.length) {
            this.router.navigate(['lv-silben1']);
            return;
        }
        this.nextAudio();
    }

}
