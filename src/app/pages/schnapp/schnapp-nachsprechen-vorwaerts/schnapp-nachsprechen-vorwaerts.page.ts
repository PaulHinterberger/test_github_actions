import {StopWatchService} from 'src/app/services/stop-watch.service';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from 'src/app/services/data.service';
import {SchnappNachsprechenVorwaertsExercise} from 'src/app/classes/exercises/schnappNachsprechenVorwaertsExercise';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-nachsprechen-vorwaerts',
  templateUrl: './schnapp-nachsprechen-vorwaerts.page.html',
  styleUrls: ['./schnapp-nachsprechen-vorwaerts.page.scss'],
})
export class SchnappNachsprechenVorwaertsPage implements OnInit {
  nextPagePressed = false;
  exercise = new SchnappNachsprechenVorwaertsExercise();
  lines: String[];
  headline = 'Übung';
  currentExamples: string[] = ['example1', 'example2'];
  currentExamplesColors: string[] = ['success', 'success'];
  counter = 1;
  highestCount = 0;
  currentTickedSum = 0;
  cols = 2;
  maxExercises = 0;
  currentLength = 0;
  lastExampleEnteredColors: string[];
  lastExampleTickedSum = 0;
  isCardActive = false;
  countFalse = 0;
  currentAudios: string[];
  currentAudio = '';
  audioCount = 0;
  playedInstruction = false;
  private debugMode = new DebugModeComponent();  

  // tslint:disable-next-line: max-line-length
  constructor(public smartAudio: SmartAudioService, public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.nextPagePressed = false;
    });
    stopWatch.start();
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-nachsprechen-vorwaerts';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.preload('instruction3_1', 'assets/schnapp/schnapp-nachsprechen-vorwaerts/audioFiles/File_24_NEU_Arbeitsgedaechtnis_vorw_merken_Instruktion.mp3');
    this.smartAudio.play('instruction3_1');
    this.sourceLoader.get('assets/schnapp/schnapp-nachsprechen-vorwaerts/stringResources/res_text.csv', {responseType: 'text'})
      .subscribe(data => {
        this.lines = data.split('\n').splice(1);
        this.maxExercises = this.lines.length;
        this.loadNextExamples();
      });
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  loadNextExamples() {
    const cols = this.lines[this.counter - 1].split(';');
    this.currentLength = +cols[2];
    if (this.counter === 0) {
      this.currentExamples = cols.slice(0, 2);
    } else {
      this.headline = 'Durchgang ' + this.counter;
      this.currentExamples = cols.slice(0, 2);
      this.currentAudios = cols.slice(3, 5);
      this.currentExamplesColors = ['success', 'success'];
    }

    this.currentTickedSum = 0;
  }

  setAsDone(index: number) {
    if (this.currentExamplesColors[index] === 'success') {
      this.currentExamplesColors[index] = 'secondary';
      this.currentTickedSum++;
    } else {
      this.currentExamplesColors[index] = 'success';
      this.currentTickedSum--;
    }
  }

  nextPage() {
    if (this.currentTickedSum === 2) {
      this.countFalse = 0;
    } else if (this.currentTickedSum === 1) {
      if (this.currentExamplesColors[0] === 'secondary') {
        if (this.countFalse !== 0) {
          this.countFalse = 0;
        }
      }
      this.countFalse++;
      if (this.currentExamplesColors[1] === 'secondary' && this.countFalse !== 3) {
        this.countFalse = 0;
      }
    } else if (this.currentTickedSum === 0) {
      this.countFalse = this.countFalse + 2;
    }

    if (this.counter !== 0) {
      this.exercise.sumCorrect += this.currentTickedSum;
      if (this.countFalse === 0) {
        this.exercise.longestSpan = this.currentLength;
      }
    }

    if (this.counter < this.maxExercises && (this.countFalse < 3 || this.counter === 0)) {
      this.lastExampleEnteredColors = this.currentExamplesColors;
      this.lastExampleTickedSum = this.currentTickedSum;
      this.counter++;
      this.cols = 3;
      this.loadNextExamples();
      this.highestCount = this.counter;
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
    this.exercise.finished = true;
    this.data.result.results.push(this.exercise);
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  lastPage() {
    this.counter--;
    this.loadNextExamples();
    this.exercise.longestSpan--;
    this.exercise.sumCorrect -= this.lastExampleTickedSum;
    this.currentTickedSum = this.lastExampleTickedSum;
    this.currentExamplesColors = this.lastExampleEnteredColors;
  }

  resetAudio() {
    this.smartAudio.play('instruction3_1');
  }
}
