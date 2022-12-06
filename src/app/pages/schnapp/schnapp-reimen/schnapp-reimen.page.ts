import {SchnappReimenExercise} from '../../../classes/exercises/schnappReimenExercise';
import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from 'src/app/services/data.service';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {AppConfig} from '../../../classes/config/AppConfig';
import { ReimenConfig } from 'src/app/classes/config/ReimenConfig';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-reimen',
  templateUrl: './schnapp-reimen.page.html',
  styleUrls: ['./schnapp-reimen.page.scss'],
})
export class SchnappReimenPage implements OnInit {

  exercise = new SchnappReimenExercise();
  items = [ new ReimenConfig(['','',''], -1, '')];
  counter = 0;
  currentSelections = [];
  checkBoxStyles = ['', '', ''];
  lastAnswerCorrect = false;
  lastAnswerSelections = [];
  back = false;
  private debugMode = new DebugModeComponent();

  constructor(public navCtrl: NavController,
              private router: Router,
              public data: DataService,
              private sourceLoader: HttpClient,
              public smartAudio: SmartAudioService, 
              public route: ActivatedRoute) {
    route.params.subscribe(val => {
        this.counter = 0;
        this.currentSelections = [];
        this.lastAnswerCorrect = false;
        this.lastAnswerSelections = [];
      }
    );
  }

  ngOnInit() {    
    this.exercise.route = 'schnapp-reimen';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.sounds = [];

    this.smartAudio.preload('audio0', 'assets/schnapp/schnapp-reimen/audioFiles/File101ReimenInstruktion1.mp3');
    this.smartAudio.preload('instruction1_1', 'assets/schnapp/schnapp-reimen/audioFiles/Ex1_File_4_Reimen_Instruktion_2MASTER.mp3');
    this.smartAudio.preload('instruction1_2', 'assets/schnapp/schnapp-reimen/audioFiles/Ex1_File_6_Reimen_Instruktion_4MASTER.mp3');
    this.smartAudio.preload('instruction1_3', 'assets/schnapp/schnapp-reimen/audioFiles/Ex1_File_8_Reime_Instruktionen_6MASTER.mp3');
    this.smartAudio.play('audio0');

    this.sourceLoader.get('assets/schnapp/schnapp-reimen/stringResources/res_text.csv', {responseType: 'text'})
      .subscribe(data => {
        const exerciseConfig = data.split('\n').splice(1);
        this.items = exerciseConfig
          .map(item => item.split(';'))
          .map(item => new ReimenConfig(
            [item[0], item[1], item[2]],
            Number(item[3]),
            item[4]
          ));
          this.nextWord();
      });
  }

  getSubtitle(){
    if (this.counter < 3) {
      return 'Übung ' + (this.counter + 1) + ' von 3';
    } else {
      return 'Durchgang ' + (this.counter - 2) + ' von 10';
    }
  }

  nextWord() {
    this.currentSelections = [];
    this.initCheckBoxStyles();   
    this.smartAudio.preload('audio' + this.counter, 'assets/schnapp/schnapp-reimen/audioFiles/' 
      + this.items[this.counter].audio);   
  }

  getCurrentRowExamples(): String[] {
    return this.items[this.counter].images;
  }

  isExercise() {
    return this.counter < 3;
  }

  initCheckBoxStyles() {
    this.checkBoxStyles = ['', '', ''];
  }

  setSelected(index: number) {
    if (this.currentSelections.length === 2) {
      if (this.checkBoxStyles.join(' ').includes('borderCorrected')) {
        // reset selections for a new click after correction 
        this.initCheckBoxStyles();
        this.currentSelections = [];
      }
      else if (!this.currentSelections.includes(index)){
        // maximum 2 selections allowed => ignore
        return;
      }
    }
    if (this.currentSelections.includes(index)){
      // deselect an already selected index
      this.currentSelections = this.currentSelections.filter(i => index !== i);
      this.checkBoxStyles[index] = '';
      return;
    }
    this.currentSelections.push(index);
    this.checkBoxStyles[index] = 'borderSelected';
    if (this.currentSelections.length === 2 && this.isExercise()) {
      this.playTutorialFeedback();
    }
  }

  playTutorialFeedback(){

    setTimeout(() => {
      this.checkBoxStyles.forEach((element, i) => {
        if (this.items[this.counter].wrongIndex !== i) {
          this.checkBoxStyles[i] = 'borderCorrected';
        }
      });
      switch(this.counter){
        case 0: this.smartAudio.play('instruction1_1'); break;
        case 1: this.smartAudio.play('instruction1_2'); break;
        case 2: this.smartAudio.play('instruction1_3'); break;
        default: break;
      }
    }, AppConfig.TimeoutTutorialFeedback);

  }
  getPicture(index: number): string {
    return 'assets/schnapp/images/' + this.getCurrentRowExamples()[index];
  }

  getPlayIcon(): string {
    return this.data.isAudioFinished ? 'play' : 'pause';
  }

  lastPage() {
    this.back = true;
    this.smartAudio.stop('audio' + this.counter);
    this.data.isAudioPlaying = false;
    this.counter--;
    this.currentSelections = this.lastAnswerSelections;
    if (this.lastAnswerCorrect) {
      this.lastAnswerCorrect = false;
      this.exercise.sumCorrect--;
    }
    this.nextWord();
    this.checkBoxStyles.forEach((element, i) =>{
      if (this.currentSelections.includes(i)) {
        this.checkBoxStyles[i] = 'borderSelected';
      }
    });
  }

  playAudio() {
    if (this.data.isAudioPlaying) {
      this.smartAudio.stop('audio' + this.counter);
      this.data.isAudioPlaying = false;
    } else {
      this.currentSelections = [];
      this.initCheckBoxStyles();
      this.smartAudio.play('audio' + this.counter);
      this.data.isAudioPlaying = true;
    }
  }

  skipExercise() {
    this.finished();
  }

  nextPage() {
    this.back = false;
    this.lastAnswerSelections = this.currentSelections;
    this.smartAudio.stop('audio' + this.counter);
    this.data.isAudioPlaying = false;
    if (!this.isExercise()){
      if (!this.currentSelections.includes(this.items[this.counter].wrongIndex) && this.currentSelections.length === 2) {
        this.exercise.sumCorrect++;
        this.lastAnswerCorrect = true;
      } else {
        this.lastAnswerCorrect = false;
      }
      this.exercise.dict[this.counter - 3] = 
        !this.currentSelections.includes(this.items[this.counter].wrongIndex) && this.currentSelections.length === 2; 
    }
    if ((this.counter + 1) === this.items.length){
      this.finished();
    }
    else{
      this.counter++;
      this.nextWord();
      this.playAudio();
    }
  }

  finished(){
    this.exercise.finished = true;
    this.data.result.results.push(this.exercise);
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  nextPageEnabled(){
    if (this.isExercise()){
      return this.checkBoxStyles.find(v => v.includes('borderCorrected')) !== undefined;
    }
    return this.currentSelections.length === 2;
  }

  resetAudio() {
    this.smartAudio.play('instruction1_1');
    this.initCheckBoxStyles();
    this.currentSelections = [];
  }
}
