import { StopWatchService } from 'src/app/services/stop-watch.service';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from 'src/app/services/data.service';
import {SchnappAnlauteErkennenExercise} from 'src/app/classes/exercises/schnappAnlauteErkennenExercise';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import { Student } from 'src/app/classes/student';
import { Examiner } from 'src/app/classes/examiner';
import {AppConfig} from '../../../classes/config/AppConfig';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
    selector: 'app-schnapp-anlaute-erkennen',
    templateUrl: './schnapp-anlaute-erkennen.page.html',
    styleUrls: ['./schnapp-anlaute-erkennen.page.scss'],
})
export class SchnappAnlauteErkennenPage implements OnInit {
    nextPagePressed = false;
    headline = 'PLACEHOLDER';
    counter = 0;
    exercise = new SchnappAnlauteErkennenExercise();
    lines: String[];
    currentLine: String[] = [];
    currentRightAnswer: number;
    correction = false;
    currentSelected = -1;
    lastAnswerCorrect = false;
    lastAnswerSelected = -1;
    highestCount = 0;
    isCardActive = false;
    playedInstruction = false;
    checkBoxStyles = ['', '', ''];
    private debugMode = new DebugModeComponent();

    constructor(public navCtrl: NavController,
                private router: Router,
                public data: DataService,
                private sourceLoader: HttpClient,
                public smartAudio: SmartAudioService,
                public route: ActivatedRoute,
                public stopWatch: StopWatchService) {
        route.params.subscribe(val => {
            this.nextPagePressed = false;
        });
        stopWatch.start();
    }

    ngOnInit() {
        this.exercise.route = 'schnapp-anlaute-erkennen';
        this.data.setExerciseProperties(this.exercise);
        this.smartAudio.sounds = [];
        this.smartAudio.preload('instruction8_1', 'assets/schnapp/schnapp-anlaute-erkennen/audioFiles/EX8_File_91_Anlaute_Instruktion_1.mp3');
        this.smartAudio.play('instruction8_1');
        this.smartAudio.preload('instruction8_2', 'assets/schnapp/schnapp-anlaute-erkennen/audioFiles/Ex8_File_92_Anlaute_Instruktion_2.mp3');
        this.sourceLoader.get('assets/schnapp/schnapp-anlaute-erkennen/stringResources/res_text.csv', {responseType: 'text'})
            .subscribe(data => {
                this.lines = data.split('\n').splice(1);
                this.nextWord();
            });
    }

    nextPageAllowed(){
        if (this.isExercise()){
            return this.checkBoxStyles.join('').includes('borderCorrected');
        }
        return this.checkBoxStyles.join('').includes('borderSelected');
    }

    changeCardActive() {
        this.isCardActive = !this.isCardActive;
    }

  resetAudio() {
    this.smartAudio.play('instruction8_1');
    this.initCheckBoxStyles();
    this.currentSelected = -1;
  }

    nextWord() {
      this.initCheckBoxStyles();
        this.playedInstruction = true;
        if (this.highestCount === this.counter) {
            this.currentSelected = -1;
        }
        this.currentLine = this.lines[this.counter].split(';');
        this.currentRightAnswer = +this.currentLine[3];
        const media = this.currentLine[4];
        this.smartAudio.preload('audio' + this.counter, 'assets/schnapp/schnapp-anlaute-erkennen/audioFiles/' + media);
        if (this.counter < 3) {
            this.headline = 'Übung ' + (this.counter + 1) + ' von 3';
        } else {
            this.headline = 'Durchgang ' + (this.counter - 2) + ' von 10';
        }
    }

    getCurrentRowExamples(): String[] {
        return this.currentLine.slice(0, 3);
    }

    isExercise() {
      return this.counter < 3;
    }

    initCheckBoxStyles() {
      this.checkBoxStyles = ['', '', ''];
    }

    setSelected(index: number) {
        this.currentSelected = index;
        this.initCheckBoxStyles();
        this.checkBoxStyles[this.currentSelected] = 'borderSelected';
        if (this.isExercise()) {
          setTimeout(() => {
            this.checkBoxStyles[this.currentRightAnswer] = 'borderCorrected';
            if (this.counter === 0) {
              this.smartAudio.play('instruction8_2');
              // tslint:disable-next-line: max-line-length
              this.smartAudio.preload('instruction8_4', 'assets/schnapp/schnapp-anlaute-erkennen/audioFiles/Ex8_File_94_Anlaute_Instruktion_4.mp3');
            } else if (this.counter === 1) {
              this.smartAudio.play('instruction8_4');
              // tslint:disable-next-line: max-line-length
              this.smartAudio.preload('instruction8_6', 'assets/schnapp/schnapp-anlaute-erkennen/audioFiles/Ex8_File_96_Anlaute_Instruktion_6.mp3');
            } else if (this.counter === 2) {
              this.smartAudio.play('instruction8_6');
            }
          }, AppConfig.TimeoutTutorialFeedback);
        }
    }

    getPicture(index: number): string {
        return 'assets/schnapp/images/' + this.currentLine[index];
    }

    getPlayIcon(): string {
        return this.data.isAudioPlaying && this.playedInstruction ? 'pause' : 'play';
    }

    lastPage() {
        this.smartAudio.stop('audio' + this.counter);

        this.counter--;
        this.currentSelected = this.lastAnswerSelected;
        if (this.lastAnswerCorrect) {
            this.lastAnswerCorrect = false;
            this.exercise.sumCorrect--;
        }
        this.nextWord();
      this.checkBoxStyles[this.currentSelected] = 'borderSelected';
    }

    playAudio() {
        if (this.data.isAudioPlaying) {
            this.smartAudio.stop('audio' + this.counter);
        } else {
            this.smartAudio.play('audio' + this.counter);
        }
        this.initCheckBoxStyles();
    }

    skipExercise() {
        this.finished();
    }

    finished(){
        this.nextPagePressed = true;
        this.exercise.finished = true;
        this.data.result.results.push(this.exercise);
        this.data.saveResult(false);
        this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
    }

    nextPage() {
        this.lastAnswerSelected = this.currentSelected;
        this.smartAudio.stop('audio' + this.counter);
        if (this.counter < this.lines.length) {
            if (!this.isExercise()) {
                if (this.currentRightAnswer === this.currentSelected) {
                    this.exercise.sumCorrect++;
                    this.lastAnswerCorrect = true;
                } else {
                    this.lastAnswerCorrect = false;
                }
                this.exercise.dict[this.counter - 3] = this.currentRightAnswer === this.currentSelected;
                this.counter++;
                this.highestCount = this.counter;
                if (this.counter < this.lines.length) {
                    this.nextWord();
                    this.playAudio();
                } else {
                    this.finished();
                }
            } else {
                    this.counter++;
                    this.highestCount = this.counter;
                    this.nextWord();
                    this.playAudio();
                }

        } else {
            if (this.nextPagePressed === false) {
                this.finished();

            }
        }
    }
}
