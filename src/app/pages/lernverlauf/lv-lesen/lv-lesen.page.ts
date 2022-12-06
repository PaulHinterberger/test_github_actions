import { GraLeVAnswer, Correct } from './../../../classes/exercises/gralevAnswer';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LesenConfig} from '../../../classes/config/LesenConfig';
import {LvLesenExercise} from '../../../classes/exercises/lvLesenExercise';
import {DataService} from 'src/app/services/data.service';
import {interval} from 'rxjs';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';
import {SmartAudioService} from '../../../services/smart-audio.service';
import {AppConfig} from '../../../classes/config/AppConfig';
import { Answer } from 'src/app/classes/exercises/Answer';

@Component({
    selector: 'app-lv-lesen',
    templateUrl: './lv-lesen.page.html',
    styleUrls: ['./lv-lesen.page.scss'],
})
export class LvLesenPage implements OnInit {
    tutorialCount = 0;
    wordCount = 0;
    correct = 0;
    progressbarValue = 0;
    currentSecond = 0;
    public showWords = false;
    words: LesenConfig[];
    numberOfWords: number;
    remainingTime = '03:00';
    timeLimitSeconds = 180;
    skippedExercise = false;
    checkBoxColor = ['', '', '', ''];
    selectedAnswer = 0;
    navigateToNextPage = false;
    exercise = new LvLesenExercise();
    exerciseFinished = false;
    private debugMode = new DebugModeComponent();
    introWord = new LesenConfig("assets/lernverlauf/02-lesen/88_nase.png", ["Hose", "Dose", "Name", "Nase"], "Nase");

    constructor(
        public router: Router,
        public data: DataService,
        public sourceLoader: HttpClient,
        public smartAudio: SmartAudioService) {
    }

    ngOnInit() {    
        this.exercise.route = 'lv-lesen';
        this.data.setExerciseProperties(this.exercise);
        this.initAudio();
        if(this.data.result === undefined){
            this.exercise.configFile = "assets/lernverlauf/02-lesen/lesen-item-config.csv";
        } 
        else{
            this.exercise.configFile = this.data.getExerciseByRoute('lv-lesen').configFile;
        }
        this.sourceLoader.get(this.exercise.configFile, {responseType: 'text'})
            .subscribe(data => {
                // console.log(data);
                const exerciseConfig = data.split('\n').splice(1);
                this.numberOfWords = exerciseConfig.length+1;
                this.words = exerciseConfig
                    .map(item => item.split(';'))
                    .map(item => new LesenConfig(
                        item[0],
                        [item[2], item[3], item[4], item[5]],
                        item[1]
                    ));
                //console.log(this.numberOfWords);
                this.words.push(new LesenConfig("", [], ""));
                this.words.unshift(this.introWord);
                //console.log(this.words);
                setTimeout(() => {
                    this.startExercise();
                }, 1000);
            });
    }

    initAudio() {
        this.smartAudio.preload('lesen-instr', 'assets/lernverlauf/audios/L1_Wortlesen/File_86_Wortlesen_Instruktion.mp3');
        this.smartAudio.preload('audio10', 'assets/lernverlauf/audios/L1_Wortlesen/Wortlesen_Aufgabe_1.mp3');
        // for (let index = 1; index <= 71; index++) {
        //     this.smartAudio.preload('audio' + index, 'assets/lernverlauf/audios/L1_Wortlesen/Wortlesen_Aufgabe_' + index + '.mp3');
        // }
    }

    isTutorial() {
        return this.tutorialCount === 0;
    }

    skipExercise() {
        this.skippedExercise = true;
        this.nextPage();
    }

    initCheckBoxColors() {
        this.checkBoxColor = ['', '', '', ''];
    }

    nextPage() {
        //console.log("hallo");
        if(!this.exerciseFinished){
            this.exerciseFinished = true;
            this.fillDict();
            this.exercise.finished = true;
            this.exercise.sumCorrect = this.correct;
            if (this.data.result !== undefined) {
                this.data.result.results.push(this.exercise);
                this.data.saveResult(false);

            }
            this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
        }        
    }

    fillDict(){
        for (; this.wordCount < this.words.length - 1; this.wordCount++) {     // Last value in words was undefined...
            console.log(this.words[this.wordCount]);
            this.exercise.dict[this.words[this.wordCount].correct] = null;            
        }
    }

    check(word: string) {
        this.navigateToNextPage = false;
        this.initCheckBoxColors();
        if (word === this.words[this.wordCount].correct && this.wordCount !== 0) {
            this.correct++;
            this.exercise.dict[this.words[this.wordCount].correct] = true;
        } else if (this.wordCount !== 0) {
            this.exercise.dict[this.words[this.wordCount].correct] = false;
        }
        //console.log(this.wordCount + ' ' + this.words[this.wordCount].correct + ' Auswahl: ' + word + ' => ' + this.correct + ' richtig');
        
        this.wordCount++;
        this.selectedAnswer = -1;

        //console.log(this.wordCount + " === " + this.numberOfWords)
        if (this.wordCount === this.numberOfWords) {
            this.nextPage();
        } else {
            this.stateChange();
            if (this.wordCount === 1) {
                this.startTimer();
            }
        }
    }

    stateChange() {
        // console.log('hide');
        this.showWords = false;
        if (this.wordCount <= 2) {
            this.smartAudio.play('lesen-instr');
        }
        const delay = this.wordCount <= 2 ? 2000 : 1000;
        setTimeout(() => {
            // console.log('show');
            if (this.wordCount === 0) {
                this.smartAudio.play('audio10');
                setTimeout(() => {
                    if (this.wordCount === 0) {
                        this.tutorialFeedback();
                    }
                }, 7000);
            }
            this.showWords = true;
        }, delay);

    }

    startExercise() {
        // this.smartAudio.preload('Jetzt', 'assets/lernverlauf/audios/L1_Wortlesen/Jetzt_du.mp3');
        // this.smartAudio.play('Jetzt');
        this.tutorialCount = 1;
        this.stateChange();
        // this.startTimer();
    }

    selectAnswer(answer: number) {
        if (this.wordCount === 0) {
            this.selectedAnswer = answer;
            this.initCheckBoxColors();
            this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
            this.navigateToNextPage = false;
            setTimeout(val => {
                this.tutorialFeedback();
            }, AppConfig.TimeoutTutorialFeedback);
        } else {
            this.initCheckBoxColors();
            // console.log(answer);
            this.selectedAnswer = answer;
            this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
            this.navigateToNextPage = true;
        }
    }

    tutorialFeedback() {
        this.checkBoxColor[3] = 'borderCorrected';
        this.navigateToNextPage = true;
    }

    getRemainingTime() {
        return new Date((this.timeLimitSeconds - this.currentSecond) * 1000).toISOString().substr(14, 5);
    }

    startTimer() {
        const timer = interval(500);

        const sub = timer.subscribe((halfSeconds) => {
            this.progressbarValue = halfSeconds / 650 * this.timeLimitSeconds;
            // console.log(this.progressbarValue);
            if (this.skippedExercise === true) {
                sub.unsubscribe();
            }
            if (halfSeconds % 2 === 0) {
                this.currentSecond = halfSeconds / 2;
                if (this.currentSecond === this.timeLimitSeconds) {
                    sub.unsubscribe();
                    this.nextPage();
                }
            }
        });
    }
}
