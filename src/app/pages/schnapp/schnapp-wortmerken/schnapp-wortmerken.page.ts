import {DataService} from 'src/app/services/data.service';
import {SchnappWortmerkenExercise} from 'src/app/classes/exercises/schnappWortmerkenExercise';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {StopWatchService} from 'src/app/services/stop-watch.service';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-wortmerken',
  templateUrl: './schnapp-wortmerken.page.html',
  styleUrls: ['./schnapp-wortmerken.page.scss'],
})
export class SchnappWortmerkenPage implements OnInit {

  exercise = new SchnappWortmerkenExercise();
  words: string[];
  protocol: string[];
  checkBoxes: Boolean[];
  isCardActive: Boolean = false;
  sumWordsCount = 0;
  exerciseStarted = false;
  maxWordsProtocol: number;
  maxWordsBuffer = 6;
  audioCurrentPlaying = false;
  playedInstruction = false;
  noteTemplates = ['Kind hat die Aufgabe nicht verstanden.;',
    'Musste auf Toilette.;',
    'Test wurde abgebrochen.;',
    'Schwankende Aufmerksamkeit.;'];
    private debugMode = new DebugModeComponent();

// tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, private smartAudio: SmartAudioService, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.isCardActive = false;
      this.sumWordsCount = 0;
      this.exerciseStarted = false;

      this.maxWordsBuffer = 6;

      this.playedInstruction = false;
    });
    stopWatch.start();
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-wortmerken';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.sounds = [];
    this.smartAudio.preload('instruction2_1', 'assets/schnapp/schnapp-wortmerken/audioFiles/File22WortmerkenInstruktion.mp3');
    this.smartAudio.play('instruction2_1');
    this.sourceLoader.get('assets/schnapp/schnapp-wortmerken/stringResources/words.csv', {responseType: 'text'})
      .subscribe(data => {
        this.words = data.split('\n').splice(1).map(s => s.split(';')[0]);
        this.maxWordsProtocol = this.words.length + this.maxWordsBuffer;
        this.checkBoxes = new Array(this.words.length);
        this.protocol = new Array(this.maxWordsProtocol);
        this.protocol = this.protocol.fill('EMPTY', 0, this.maxWordsProtocol);
      });
    const media = 'audioExercise2.MP3';
    this.smartAudio.preload('instruction2_2', 'assets/schnapp/schnapp-wortmerken/audioFiles/Ex2_File_20_Wortmerken_Items.mp3');
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  skipExercise() {
    this.nextPage();
  }

  nextPage() {
    this.exercise.finished = true;
    this.data.result.results.push(this.exercise);
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  add(word: string) {
    if (this.sumWordsCount === this.maxWordsProtocol) {
      return;
    }
    if (word === 'Falsch') {
      this.exercise.sumFalse++;
    } else if (!this.protocol.includes(word)) {
      this.exercise.sumCorrect++;
    } else {
      this.exercise.sumRepetitions++;
      this.checkBoxes[this.words.indexOf(word)] = true;
    }
    this.protocol[this.protocol.findIndex(s => s.includes('EMPTY'))] = word;
    this.sumWordsCount++;
  }

  getCheckBox(word: string) {
    return this.checkBoxes[this.words.indexOf(word)];
  }

  removeWord(index: number, word: string) {
    this.protocol = this.protocol.filter((_s, i) => i !== index);
    this.sumWordsCount--;
    this.protocol.push('EMPTY');
    if (word === 'Falsch') {
      this.exercise.sumFalse--;
    } else if (this.protocol.includes(word)) {
      this.exercise.sumRepetitions--;
      if (this.protocol.filter(singleWord => singleWord === word).length === 1) {
        this.checkBoxes[this.words.indexOf(word)] = false;
      }
    } else {
      this.exercise.sumCorrect--;
    }
  }

  resetAudio() {
    this.smartAudio.play('instruction2_1');
  }

  playAudio() {
    if (!this.playedInstruction){
      setTimeout(() => {
        this.exerciseStarted = true;
      }, 15000);
    }
   
    this.playedInstruction = true;
    if (this.audioCurrentPlaying) {
      this.smartAudio.stop('instruction2_2');
      this.audioCurrentPlaying = false;
    } else {
      this.smartAudio.play('instruction2_2');
      this.audioCurrentPlaying = true;
    }
  }

  getPlayIcon(): string {
    return this.data.isAudioPlaying && this.playedInstruction ? 'pause' : 'play';
  }

  addToTextArea(index: number) {
    this.exercise.note += this.noteTemplates[index];
  }
}
