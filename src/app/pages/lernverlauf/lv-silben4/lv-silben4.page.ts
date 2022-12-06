import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {SmartAudioService} from '../../../services/smart-audio.service';
import {CdkDragDrop, copyArrayItem, transferArrayItem} from '@angular/cdk/drag-drop';
import {SilbenConfig} from '../../../classes/config/SilbenConfig';
import {timer, observable} from 'rxjs';
import {LvSilbenExercise} from '../../../classes/exercises/lvSilbenExercise';
import { DebugModeComponent } from '../../../common-components/debug-mode/debug-mode.component';

@Component({
    selector: 'app-lv-silben4',
    templateUrl: './lv-silben4.page.html',
    styleUrls: ['./lv-silben4.page.scss'],
})
export class LvSilben4Page implements OnInit {
    exerciseIsSkipped = false;

    constructor(
        public router: Router,
        public data: DataService,
        public smartAudio: SmartAudioService
    ) {
    }

    checkButtonDisabled: boolean;
    stonesList: SilbenConfig[];
    firstAnswersBox: SilbenConfig[];
    secondAnswersBox: SilbenConfig[];
    thirdAnswersBox: SilbenConfig[];
    draggedItem: SilbenConfig;
    askedList: SilbenConfig[];
    tutorialCount = -1;
    tutorialEndCount = 4;
    wordCount = 0;
    tutorialArray: SilbenConfig[];
    correctAnswerCount = 0;
    wrongAnswerCountInARow = 0;
    tutorialPic: SilbenConfig;
    debugMode = new DebugModeComponent();
    exercise = new LvSilbenExercise();
    tutorialAudio: Array<string> = [
        'assets/lernverlauf/audios/L1_Silben/File_73_Konzeptname_Instruktion_1.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_74_Konzeptname_Instruktion_2.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_75_Konzeptname_Instruktion_3.mp3'];

    exeAudio: Array<string> = [
        'assets/lernverlauf/audios/L1_Silben/File_76_Konzeptname_Aufgabe_1.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_77_Konzeptname_Aufgabe_2.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_78_Konzeptname_Aufgabe_3.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_79_Konzeptname_Aufgabe_4.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_80_Konzeptname_Aufgabe_5.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_81_Konzeptname_Aufgabe_6.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_82_Konzeptname_Aufgabe_7.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_83_Konzeptname_Aufgabe_8.mp3',
        'assets/lernverlauf/audios/L1_Silben/File_84_Konzeptname_Aufgabe_9.mp3', ];

    // timer
    tutorialTimer = null;
    secondsPassed = 0;
    debugModeIsEnabled = false;
    ngOnInit() {
        this.exercise.route = 'lv-silben4';
        this.data.setExerciseProperties(this.exercise);
        this.smartAudio.sounds = []; // fix for wrong audio preload
        this.intiTutorial();
        this.initAskedList();
        this.preloadAudios();
        this.resetTutorial();
    }

    skipExercise()
    {
        this.exerciseIsSkipped = true;
        this.smartAudio.audioPlayer.pause();
        this.startExercise();
        this.nextPage();
    }
    skipTutorial() {
        this.smartAudio.audioPlayer.pause();
        this.debugModeIsEnabled = true;
        this.tutorialCount = this.tutorialEndCount;
        this.wordCount = 0;
        this.stopTimer();
        this.tutorialCount = this.tutorialEndCount;
        this.startExercise();
    }
    intiTutorial() {
        this.tutorialArray = [
            new SilbenConfig('assets/lernverlauf/01-silben/stoneBig.png', 'bigStone', '2'),
            new SilbenConfig('assets/lernverlauf/01-silben/stoneSmall.png', 'smallStone', '1')
        ];
        this.tutorialPic =
            new SilbenConfig('assets/lernverlauf/01-silben/schlitten.png', 'Schlitten', '21');
    }
    initAskedList() {
        this.askedList = [
            new SilbenConfig('assets/lernverlauf/01-silben/raetsel.png', 'Raetsel', '21'),
            new SilbenConfig('assets/lernverlauf/01-silben/pokal.png', 'Pokal', '12'),
            new SilbenConfig('assets/lernverlauf/01-silben/gewicht.png', 'Gewicht', '12'),
            new SilbenConfig('assets/lernverlauf/01-silben/domino.png', 'Domino', '211'), // Silbenanzahl 3 reihenfolge?
            new SilbenConfig('assets/lernverlauf/01-silben/sandale.png', 'Sandale', '121'),
            new SilbenConfig('assets/lernverlauf/01-silben/krokodil.png', 'Krokodil', '112'),
            new SilbenConfig('assets/lernverlauf/01-silben/schluessel.png', 'Schluessel', '21'),
            new SilbenConfig('assets/lernverlauf/01-silben/regen.png', 'Regen', '21'),
            new SilbenConfig('assets/lernverlauf/01-silben/salami.png', 'Salami', '121'),
        ];
    }

    preloadAudios() {

        // Kling KLang Init
        this.smartAudio.preload('klang', 'assets/lernverlauf/audios/L1_Silben/Klang.mp3');
        this.smartAudio.preload('kling', 'assets/lernverlauf/audios/L1_Silben/Kling.mp3');
        this.smartAudio.preload('silben12', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_2.mp3');
        this.smartAudio.preload('silben21', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_2.mp3');
        this.smartAudio.preload('silben11', 'assets/lernverlauf/audios/L1_Silben/Kling_Kling_2.mp3');
        this.smartAudio.preload('silben22', 'assets/lernverlauf/audios/L1_Silben/Klang_Klang_2.mp3');
              
        this.smartAudio.preload('silben111', 'assets/lernverlauf/audios/L1_Silben/Klang_Klang_Klang_2.mp3');
        // this.smartAudio.preload('silben112', 'assets/lernverlauf/audios/L1_Silben/Klang_Klang_Kling_2.mp3');
        // this.smartAudio.preload('silben121', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_Klang_2.mp3');
        this.smartAudio.preload('silben122', 'assets/lernverlauf/audios/L1_Silben/Klang_Kling_Kling_2.mp3');
        // this.smartAudio.preload('silben211', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_Klang_2.mp3');
        this.smartAudio.preload('silben212', 'assets/lernverlauf/audios/L1_Silben/Kling_Klang_Kling_2.mp3');
        this.smartAudio.preload('silben221', 'assets/lernverlauf/audios/L1_Silben/Kling_Kling_Klang_2.mp3');
        this.smartAudio.preload('silben222', 'assets/lernverlauf/audios/L1_Silben/Kling_Kling_Kling_2.mp3');

        // TODO: add 3-silber kling-klangs

        this.smartAudio.preload('tutorial1', this.tutorialAudio[0]);
        this.smartAudio.preload('tutorial2', this.tutorialAudio[1]);
        this.smartAudio.preload('tutorial3', this.tutorialAudio[2]);
        // Init audios
        for (let index = 0; index < this.exeAudio.length; index++) {
            //    console.log("preload:"+ this.exeAudio[index]);
            this.smartAudio.preload('exe' + index, this.exeAudio[index]);
        }
    }

    resetBoxes() {
        this.initStonesToolbox();
        this.clearAnswerBoxes();
    }

    clearAnswerBoxes() {
        this.firstAnswersBox = [];
        this.secondAnswersBox = [];
        this.thirdAnswersBox = [];
    }

    initStonesToolbox() {
        this.stonesList = [
            new SilbenConfig('assets/lernverlauf/01-silben/stoneBig.png', 'bigStone', '2'),
            new SilbenConfig('assets/lernverlauf/01-silben/stoneSmall.png', 'smallStone', '1')];

        this.draggedItem = undefined;
    }

    resetTutorial() {
        this.tutorialCount = -1;
        this.wordCount = 0;
        this.stopTimer();
        this.secondsPassed = 0;
        // this.smartAudio.stop;
        this.initStonesToolbox();
        this.clearAnswerBoxes();
        this.startTimer();

    }

    help() {
        this.clearAnswerBoxes();
        this.firstAnswersBox[0] = this.tutorialArray[0];
        this.secondAnswersBox[0] = this.tutorialArray[1];
    }

    isHelpEnabled() {
        return (this.tutorialCount < this.tutorialEndCount);
    }

    getRequestedSilbenCount() {
        if (this.wordCount > this.askedList.length - 1) {
            return 2;
        }
        return this.askedList[this.wordCount].silben.length;
    }


    getColspanThirdBox() {
        let span = 0;
        if (this.askedList[this.wordCount].silben.length === 3) {
            span = 2;
        }
        return span;
    }

 

    playExerciseAudio() {
        this.smartAudio.play('exe' + this.wordCount);
    }

    getPlayIcon(): string {
        return this.data.isAudioPlaying ? 'pause' : 'volume-high';
    }

    nextPage() {
        this.exercise.finished = true;
        this.exercise.correct = this.correctAnswerCount === 5;
        if (this.data.result !== undefined) {
            this.data.result.results.push(this.exercise);
            this.data.saveResult(false);
        }
        this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
    }

    startExercise() {
        // console.log('startExercise');
        this.stopTimer();
        this.tutorialCount = this.tutorialEndCount;
        this.wordCount++;
        this.playExerciseAudio();
        this.resetBoxes();
    }

    isAnswerComplete() {
        // check if any required answerbox is empty
        if (this.firstAnswersBox.length === 0 ||
            this.secondAnswersBox.length === 0 ||
            ((this.askedList[this.wordCount].silben).length === 3 && this.thirdAnswersBox.length === 0)) {
            return false;
        }
        return true;
    }

    checkAnswer() {

        if (this.tutorialCount < this.tutorialEndCount) {
            this.startExercise();
            return;

        }
        // check if exercise is completed
        if (this.correctAnswerCount === 5 || this.wordCount > (this.askedList.length - 1)) {
            this.checkButtonDisabled = true;
        }

        // check if any required answerbox is empty
        if (this.firstAnswersBox.length === 0 ||
            this.secondAnswersBox.length === 0 ||
            ((this.askedList[this.wordCount].silben).length === 3 && this.thirdAnswersBox.length === 0)) {
            // console.log('Error itembox empty!');
            return;
        }

        // check if answer is correct
        if (this.firstAnswersBox[0].silben[0] === (this.askedList[this.wordCount].silben)[0] &&
            this.secondAnswersBox[0].silben[0] === (this.askedList[this.wordCount].silben)[1]) {
            if ((this.askedList[this.wordCount].silben).length === 3) {
                if (this.thirdAnswersBox[0].silben[0] === (this.askedList[this.wordCount].silben)[2]) {
                    this.correctAnswerCount++;
                    this.wrongAnswerCountInARow = 0;
                } else {
                    this.wrongAnswerCountInARow++;
                }

            } else {
                this.correctAnswerCount++;
                this.wrongAnswerCountInARow = 0;
            }
        } else {
            this.wrongAnswerCountInARow++;
        }
        if (this.wordCount === this.askedList.length - 1 || this.wrongAnswerCountInARow === 5 || this.correctAnswerCount === 5) {
            this.nextPage();
        } else {
            this.wordCount++;
            this.resetBoxes();
            this.playExerciseAudio();
        }
    }

    playSelectedStones() {
        let klingKlangStyle = 'silben';
        if (this.firstAnswersBox.length > 0) {
            klingKlangStyle += this.firstAnswersBox[0].silben;
        }
        if (this.secondAnswersBox.length > 0) {
            klingKlangStyle += this.secondAnswersBox[0].silben;
        }
        if (this.thirdAnswersBox.length > 0) {
            klingKlangStyle += this.thirdAnswersBox[0].silben;
        }
        // TODO: 3-silber!
        // console.log(klingKlangStyle);
        this.smartAudio.play(klingKlangStyle);
    }

    triggerNextTutorial() {
        // console.log(this.secondsPassed);
        switch (this.secondsPassed) {
            case 1:
                this.smartAudio.play('tutorial1');
                this.tutorialCount++;
                break;
            case 3:
                this.smartAudio.play('tutorial2');
                this.tutorialCount++;
                break;
            case 10:
                this.secondAnswersBox = [];
                break;
            case 14:
                // console.log('13 seconds passed');
                this.firstAnswersBox[0] = this.tutorialArray[0];
                break;
            case 15:
               this.secondAnswersBox[0] = this.tutorialArray[1];
                break;
            case 17:
                // console.log('16 seconds passed');
                this.playSelectedStones();
                break;
            case 19:
                this.smartAudio.play('tutorial3');
                this.tutorialCount++;
                break;
        }
 
    }

    cdkDragStarted(event: CdkDragDrop<string[]>, item: SilbenConfig){
        // console.log(`started dragging of ${item.description} from toolbox`);
        // console.log(item);
        // console.log(event);
        this.draggedItem = item;
    }

    dropToToolbox(event: CdkDragDrop<string[]>) {
        // console.log('dropped back to toolbox');
    }

    enterAnswerBox(event: CdkDragDrop<string[]>, index: number) {
        // console.log(`entered answer box ${index}`);
        // console.log(event);
        event.container.data.pop();
        if (this.draggedItem){
            this.stonesList.push(this.draggedItem);
            this.stonesList.sort((a, b) => a.description.localeCompare(b.description));
            this.draggedItem = undefined;
        }
    }

    dropToAnswerBox(event: CdkDragDrop<string[]>, index: number) {
        // console.log(`dropped into answer ${index}`);
        if (event.previousContainer.id === event.container.id) {
            // console.log('Transfer to itself: do nothing ' + event.container.id);
            switch(event.container.id){
                case "answer1" : this.firstAnswersBox = []; break;
                case "answer2" : this.secondAnswersBox = []; break;
                case "answer3" : this.thirdAnswersBox = []; break;
                default: console.log("do nothing"); break;
            }
        } else if (event.previousContainer.id === 'toolbox') {
            // console.log('Copy from toolbox to ' + event.container.id);
            // ensure to clear the current answer before dropping the new stone
            event.container.data.pop();
            copyArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                0);
        } else {
            // console.log(`Move from answer box ${event.previousContainer.id} to ${event.container.id}`);
            event.container.data.pop();
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                0);
        }
        this.initStonesToolbox();
    }
    

    startTimer() {
        // console.log('startTimer');
        this.tutorialTimer = setInterval(v => {
            this.secondsPassed++;
            this.triggerNextTutorial();
        }, 2000);
    }

    stopTimer() {
        if (this.tutorialTimer != null) {
            clearInterval(this.tutorialTimer);
            this.secondsPassed = 0;
        }
    }

}



