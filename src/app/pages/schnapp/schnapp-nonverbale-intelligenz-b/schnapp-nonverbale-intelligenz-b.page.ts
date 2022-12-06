import {StopWatchService} from 'src/app/services/stop-watch.service';
import {SchnappNonverbaleIntelligenzExercise} from 'src/app/classes/exercises/schnappNonverbaleIntelligenzExercise';
import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {HttpClient} from '@angular/common/http';
import {Student} from 'src/app/classes/student';
import {Examiner} from 'src/app/classes/examiner';
import {Result} from '../../../classes/result';
import {GrawoConfig} from '../../../classes/config/GrawoConfig';
import {BilderreihenConfig} from '../../../classes/config/BilderreihenConfig';
import {AppConfig} from "../../../classes/config/AppConfig";
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-nonverbale-intelligenz-b',
  templateUrl: './schnapp-nonverbale-intelligenz-b.page.html',
  styleUrls: ['./schnapp-nonverbale-intelligenz-b.page.scss'],
})
export class SchnappNonverbaleIntelligenzBPage implements OnInit {
  exercise: SchnappNonverbaleIntelligenzExercise;
  headline: String = 'Durchgang';
  currentlySelected = 0;
  back = true;
  lastAnswerCorrect = false;
  isCardActive = false;
  items: BilderreihenConfig [] = [
    new BilderreihenConfig(0, ['', '', '', '', ''], true)
  ];
  public false_cnt = 0;
  currentItem = 0;
  checkBoxStyles = ['', '', '', '', ''];
  lastAnswer = -1;
  private debugMode = new DebugModeComponent();

  // tslint:disable-next-line: max-line-length
  constructor(public smartAudio: SmartAudioService, public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, public stopWatch: StopWatchService) {
    stopWatch.start();
  }

  ngOnInit() {
    this.smartAudio.preload('instruction11b_1', 'assets/schnapp/schnapp-nonverbale-intelligenz-b/audioFiles/File44BilderreihenInstruktion1.mp3');
    this.smartAudio.play('instruction11b_1');
    // tslint:disable-next-line: max-line-length
    this.smartAudio.preload('instruction11b_2', 'assets/schnapp/schnapp-nonverbale-intelligenz-b/audioFiles/EX12_File_135_unpassende_Bilder_Instruktion_2MASTER.mp3');
    //this.exercise = this.data.result.results.find(x => x.number === 11) as SchnappNonverbaleIntelligenzExercise;
    if (this.data.result !== undefined) {
      this.exercise = this.data.getExerciseResultByRoute('schnapp-nonverbale-intelligenz-a') as SchnappNonverbaleIntelligenzExercise;
    } else {
      this.exercise = new SchnappNonverbaleIntelligenzExercise();
    }
    this.sourceLoader.get('assets/schnapp/schnapp-nonverbale-intelligenz-b/stringResources/res_text.csv', {responseType: 'text'})
      .subscribe(data => {
        const exerciseConfig = data.split('\n').splice(1);
        this.items = exerciseConfig
          .map(item => item.split(';'))
          .map(item => new BilderreihenConfig(
            Number(item[0]),
            [item[1], item[2], item[3], item[4], item[5]],
            item[5] === '-1'
          ));
      });
  }

  initCheckBoxStyles() {
    this.checkBoxStyles = ['', '', '', '', ''];
  }

  nextPageAllowed() {
    if (this.isExercise()) {
      return this.checkBoxStyles.join('').includes('borderCorrected');
    }
    return this.checkBoxStyles.join('').includes('borderSelected');
  }

  getImageIndices() {
    if (this.items[this.currentItem].isExample) {
      return [1, 2, 3, 4];
    }
    return [1, 2, 3, 4, 5];
  }

  getSubtitle() {
    if (this.items[this.currentItem].isExample) {
      return 'Übung ' + (this.currentItem + 1) + ' von 2';
    }
    return 'Durchgang ' + (this.currentItem - 1);
  }

  resetAudio() {
    this.smartAudio.play('instruction11b_1');
    this.initCheckBoxStyles();
  }

  lastExists(): boolean {
    return !this.items[this.currentItem].isExample;
  }

  getImage(index: number): String {
    return 'assets/schnapp/schnapp-nonverbale-intelligenz-b/images/' + this.items[this.currentItem].images[index - 1] + '.PNG';
  }

  getCurrentColumns(): number {
    return this.lastExists() ? 5 : 4;
  }

  skipExercise() {
    this.finished();
  }

  nextPage() {
    this.back = false;
    this.checkResult();
    this.initCheckBoxStyles();
    this.lastAnswer = this.currentlySelected;
    if (this.currentItem < this.items.length && this.false_cnt <= 3 && this.currentItem <= 31) {
      this.currentItem++;
      this.currentlySelected = 0;
    } else {
      this.finished();
    }
  }

  finished(){
    this.exercise.finished = true;
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  isExercise(){
    return this.currentItem < 2;
  }

  enterResult(answer: number) {
    this.currentlySelected = answer;
    this.initCheckBoxStyles();
    this.checkBoxStyles[this.currentlySelected - 1] = 'borderSelected';
    if (this.isExercise()) {
      setTimeout(() => {
        this.checkBoxStyles[+this.items[this.currentItem].correctIndex -1] = 'borderCorrected';
      }, AppConfig.TimeoutTutorialFeedback);
    }
  }

  lastPage() {
    this.currentItem--;
    this.back = true;
    this.initCheckBoxStyles();
    this.checkBoxStyles[this.lastAnswer -1] = 'borderSelected';
    if (this.lastAnswerCorrect) {
      this.lastAnswerCorrect = false;
      this.exercise.sumCorrectB--;
    } else {
      this.lastAnswerCorrect = false;
    }
  }

  checkResult() {
    if (this.currentItem <= 1) {
      return;
    }
    if (this.currentlySelected === +this.items[this.currentItem].correctIndex) {
      this.exercise.sumCorrectB++;
      this.false_cnt = 0;
      this.lastAnswerCorrect = true;
    } else {
      this.false_cnt++;
      this.lastAnswerCorrect = false;
    }
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }
}
