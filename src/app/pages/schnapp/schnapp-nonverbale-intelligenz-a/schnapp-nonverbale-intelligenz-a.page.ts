import {StopWatchService} from 'src/app/services/stop-watch.service';
import {SchnappNonverbaleIntelligenzExercise} from 'src/app/classes/exercises/schnappNonverbaleIntelligenzExercise';
import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {HttpClient} from '@angular/common/http';
import {Student} from 'src/app/classes/student';
import {Examiner} from 'src/app/classes/examiner';
import {Result} from 'src/app/classes/result';
import {AppConfig} from '../../../classes/config/AppConfig';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-nonverbale-intelligenz-a',
  templateUrl: './schnapp-nonverbale-intelligenz-a.page.html',
  styleUrls: ['./schnapp-nonverbale-intelligenz-a.page.scss'],
})
export class SchnappNonverbaleIntelligenzAPage implements OnInit {
  nextPagePressed = false;
  exercise = new SchnappNonverbaleIntelligenzExercise();
  headline: String = 'Durchgang';
  correctAnswers: String[];
  currentlySelected = 0;
  example = 0;
  back = true;
  counter = 1;
  max = 0;
  countAnswers = 0;
  lastAnswerCorrect = false;
  lastAnswerSelected = -1;

  public time = '00:00';

  public false_cnt = 0;
  isCardActive = false;
  instruction: string;
  currentLine: string[] = [];
  checkBoxStyles = ['', '', '', '', ''];
  private debugMode = new DebugModeComponent();

  constructor(public smartAudio: SmartAudioService, public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.nextPagePressed = false;
    });
    stopWatch.start();
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-nonverbale-intelligenz-a';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.preload('instruction11a_1', 'assets/schnapp/schnapp-nonverbale-intelligenz-a/audioFiles/File45MatrizenInstruktion1.mp3');
    this.smartAudio.play('instruction11a_1');
    this.smartAudio.preload('instruction11a_2', 'assets/schnapp/schnapp-nonverbale-intelligenz-a/audioFiles/File46MatrizenInstruktion2.mp3');

    this.sourceLoader.get('assets/schnapp/schnapp-nonverbale-intelligenz-a/stringResources/res_text.csv', {responseType: 'text'})
      .subscribe(data => {
        this.correctAnswers = data.split('\n').splice(1);
        this.currentLine = this.correctAnswers[this.counter - 1].split(';');
        this.max = this.correctAnswers.length;
      });
  }

  nextPageAllowed(){
    if (this.isExercise()){
      return this.checkBoxStyles.join('').includes('borderCorrected');
    }
    return this.checkBoxStyles.join('').includes('borderSelected');
  }

  resetAudio() {
    this.smartAudio.play('instruction11a_1');
    this.initCheckBoxStyles();
  }

  lastExists(): boolean {
    if (this.currentLine != null) {
      if (+this.currentLine[6] !== -1) {
        return true;
      }
    }
    return false;
  }

  getImage(index: number): String {
    if (this.currentLine != null) {
      return 'assets/schnapp/schnapp-nonverbale-intelligenz-a/images/' + this.currentLine[index + 1] + '.PNG';
    } else {
      return '"assets/picture/digit/Number' + index + '.png"';
    }
  }

  getCurrentColumns(): number {
    return this.lastExists() ? 5 : 4;
  }

  getSubtitle() {
    if (this.counter <= 3) {
      return 'Übung ' + (this.counter) + ' von 3';
    }
    return 'Durchgang ' + (this.counter - 3);
  }

  nextPage() {
    this.initCheckBoxStyles();
    this.back = false;
    this.checkResult();
    this.lastAnswerSelected = this.currentlySelected;
    if (this.counter <= this.correctAnswers.length - 1 && this.false_cnt <= 3) {
      this.counter++;
      this.currentLine = this.correctAnswers[this.counter - 1].split(';');
      this.currentlySelected = 0;
    } else {
      if (this.nextPagePressed === false) {
        this.nextPagePressed = true;
        this.finished();
      }
    }
  }

  skipExercise() {
    this.finished();
  }

  finished(){
    this.stopWatch.stop();
    this.stopWatch.reset();
    this.exercise.finished = false;                   // Exercise 11b to be done
    if(this.data.result !== undefined){
      this.data.result.results.push(this.exercise);
      this.data.saveResult(false);
    }
    this.router.navigate(['schnapp-nonverbale-intelligenz-between']);
  }

  isExercise() {
    return this.counter < 4;
  }

  initCheckBoxStyles() {
    this.checkBoxStyles = ['', '', '', '', ''];
  }

  enterResult(answer: number) {
    this.currentlySelected = answer;
    this.initCheckBoxStyles();
    this.checkBoxStyles[this.currentlySelected - 1] = 'borderSelected';
    if (this.isExercise()) {
      setTimeout(() => {
        this.checkBoxStyles[+this.currentLine[0] - 1] = 'borderCorrected';
      }, AppConfig.TimeoutTutorialFeedback);
    }
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  lastPage() {
    this.counter--;
    this.currentLine = this.correctAnswers[this.counter - 1].split(';');
    this.back = true;
    if (this.lastAnswerCorrect) {
      this.lastAnswerCorrect = false;
      this.exercise.sumCorrectA--;
    } else {
      this.false_cnt--;
      this.lastAnswerCorrect = false;
    }
    this.initCheckBoxStyles();
    this.checkBoxStyles[this.lastAnswerSelected - 1] = 'borderSelected';
  }

  checkResult() {
    if (this.isExercise()) {
      return;
    }
    if (this.currentlySelected === +this.currentLine[0]) {
      this.exercise.sumCorrectA++;
      this.false_cnt = 0;
      this.lastAnswerCorrect = true;
    } else {
      this.false_cnt++;
      this.lastAnswerCorrect = false;
    }
  }
}
