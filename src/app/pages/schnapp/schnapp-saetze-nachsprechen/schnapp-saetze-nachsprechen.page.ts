import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from 'src/app/services/data.service';
import {SchnappSaetzeNachsprechenExercise} from 'src/app/classes/exercises/schnappSaetzeNachsprechenExercise';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';
@Component({
  selector: 'app-schnapp-saetze-nachsprechen',
  templateUrl: './schnapp-saetze-nachsprechen.page.html',
  styleUrls: ['./schnapp-saetze-nachsprechen.page.scss'],
})
export class SchnappSaetzeNachsprechenPage implements OnInit {
  nextPagePressed = false;
  exercise = new SchnappSaetzeNachsprechenExercise();
  lines: String[] = [];
  answers: String[] = [];
  page = 0;
  viewLines: String[] = [];
  isCardActive = false;
  currentlyPlaying = -1;
  private debugMode = new DebugModeComponent();

  constructor(
    public navCtrl: NavController,
    private router: Router,
    public data: DataService,
    private sourceLoader: HttpClient,
    private smartAudio: SmartAudioService,
    public route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.nextPagePressed = false;
    });
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-saetze-nachsprechen';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.sounds = [];
    this.smartAudio.preload('instruction6_1', 'assets/schnapp/schnapp-saetze-nachsprechen/audioFiles/File120NachsprechenSaetzeInstruktion19.mp3');
    this.smartAudio.play('instruction6_1');
    this.sourceLoader.get('assets/schnapp/schnapp-saetze-nachsprechen/stringResources/sentences.csv', {responseType: 'text'})
      .subscribe(data => {
        this.lines = data.split('\n').splice(1);
        this.nextPage();
      });
  }

  getItem(index: number): string {
    return this.viewLines[index].split(';')[0];
  }

  resetAudio() {
    // tslint:disable-next-line: max-line-length
    this.smartAudio.preload('instruction6_1', 'assets/schnapp/schnapp-saetze-nachsprechen/audioFiles/File120NachsprechenSaetzeInstruktion19.mp3');
    this.smartAudio.play('instruction6_1');
  }

  calculateResult() {
    // tslint:disable-next-line:forin
    for (const i in this.answers) {
      let correct = false;
      if (this.answers[+i] === 'correct') {
        this.exercise.sumCorrect++;
        correct = true;
      }
      this.exercise.dict[this.getItem(+i)] = correct;
    }

  }

  playAudio(index: number) {
    if (this.currentlyPlaying !== index && this.currentlyPlaying !== -1) {
      this.smartAudio.stop('audio' + this.currentlyPlaying);
      const media = this.viewLines[index].split(';')[1];
      this.smartAudio.preload('audio' + index, 'assets/schnapp/schnapp-saetze-nachsprechen/audioFiles/' + media);
      this.smartAudio.play('audio' + index);
      this.currentlyPlaying = index;
    } else if (this.currentlyPlaying !== -1) {
      this.smartAudio.stop('audio' + this.currentlyPlaying);
      this.currentlyPlaying = -1;
    } else {
      const media = this.viewLines[index].split(';')[1];
      this.smartAudio.preload('audio' + index, 'assets/schnapp/schnapp-saetze-nachsprechen/audioFiles/' + media);
      this.smartAudio.play('audio' + index);
      this.currentlyPlaying = index;
    }
  }

  getPlayIcon() {
    if (this.data.isAudioPlaying) {
      return this.currentlyPlaying;
    }
  }

  nextPage() {
    this.calculateResult();

    if (this.currentlyPlaying !== -1) {
      this.smartAudio.stop('audio' + this.currentlyPlaying);
      this.currentlyPlaying = -1;
    }
    this.smartAudio.sounds = [];
    if (this.lines.length === 0) {
      if (this.nextPagePressed === false) {
        this.nextPagePressed = true;
        this.finished();
      }
    }
    this.nextSentences();
  }

  skipExercise() {
    this.finished();
  }

  finished(){
    this.exercise.finished = true;
    this.data.result.results.push(this.exercise);
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  nextSentences() {
    if (this.lines.length > 5) {
      this.viewLines = this.lines.splice(0, 5);
    } else {
      this.viewLines = this.lines.splice(0, this.lines.length);
    }
    this.answers = new Array(this.viewLines.length);
    this.answers.fill('noAnswer', 0, this.viewLines.length);
    this.page++;
  }

  getIfAllAreSelected(): Boolean {
    for (const i of this.answers) {
      if (i === 'default') {
        return false;
      }
    }
    return true;
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }
}
