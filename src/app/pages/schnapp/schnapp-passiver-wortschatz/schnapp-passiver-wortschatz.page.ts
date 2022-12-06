
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {DataService} from 'src/app/services/data.service';
import {SchnappPassiverWortschatzExercise} from 'src/app/classes/exercises/schnappPassiverWortschatzExercise';
import {GrawoConfig} from '../../../classes/config/GrawoConfig';
import { Answer, Correct } from 'src/app/classes/exercises/Answer';
import { AppConfig } from 'src/app/classes/config/AppConfig';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-passiver-wortschatz',
  templateUrl: './schnapp-passiver-wortschatz.page.html',
  styleUrls: ['./schnapp-passiver-wortschatz.page.scss'],
})
export class SchnappPassiverWortschatzPage implements OnInit {

  constructor(
    public navCtrl: NavController,
    private router: Router,
    public data: DataService,
    private sourceLoader: HttpClient,
    private smartAudio: SmartAudioService,
    public route: ActivatedRoute) {
    route.params.subscribe(val => {

    });
  }

  exercise = new SchnappPassiverWortschatzExercise();
  currentlyPlaying = -1;
  currentlySelected = -1;
  numberOfWords = 0;
  nrOfExercises = 2;
  playingInstruction = false;
  isAudioButtonVisible = true;
  counter = 0;
  items: GrawoConfig [] = [
    new GrawoConfig(0, ['', '', '', ''], '', '')
  ];
  currentItem = 0;
  headline = 'GRAWO Test';
  checkBoxStyles = ['', '', '', ''];
  lastAnswer: Answer;
  lastIndexSelected = -1;
  back = false;
  private debugMode = new DebugModeComponent();


  ngOnInit() {
    this.exercise.route = 'schnapp-passiver-wortschatz';
    if (this.data.current_testset != null && !this.data.current_testset.title.toLowerCase().includes('grawo')) {
      this.data.setExerciseProperties(this.exercise);         //tbd grawo with new generic exercise config
    }
    this.smartAudio.sounds = [];

    this.smartAudio.preload('instruction10_1', 'assets/schnapp/schnapp-passiver-wortschatz/audioFiles/File137WortschatzInstruktion1.mp3');
    this.smartAudio.preload('instruction10_2', 'assets/schnapp/schnapp-passiver-wortschatz/audioFiles/File137WortschatzInstruktion1_1.mp3');

    // let csvFile = 'assets/schnapp/schnapp-passiver-wortschatz/stringResources/grawo-test-3-items.csv';
    let csvFile = 'assets/schnapp/schnapp-passiver-wortschatz/stringResources/grawo-config.csv';
    if (this.data.current_testset != null && this.data.current_testset.title.toLowerCase().includes('grawo')) {
      if (this.data.current_testset.title.toLowerCase().includes('grawo-kurz')) {
        this.headline = 'GRAWO Kurztest: ' + this.exercise.title;
        this.smartAudio.play('instruction10_2');
        csvFile = 'assets/schnapp/schnapp-passiver-wortschatz/stringResources/grawo-kurz.csv';
      } else {
        this.headline = 'GRAWO Test: ' + this.exercise.title;
        this.smartAudio.play('instruction10_2');
      }
    } else {
      this.headline = 'Kapitel ' + this.exercise.number +  ': ' + this.exercise.title;
      this.smartAudio.play('instruction10_1');
    }

    this.sourceLoader.get(csvFile, {responseType: 'text'})
      .subscribe(data => {
        const exerciseConfig = data.split('\n').splice(1);
        this.numberOfWords = exerciseConfig.length;
        this.items = exerciseConfig
          .map(item => item.split(';'))
          .map(item => new GrawoConfig(
            Number(item[4]),
            [item[0], item[1], item[2], item[3]],
            item[5],
            item[6]
          ));

      });

    // tslint:disable-next-line: max-line-length

    this.smartAudio.preload('instruction10_2', 'assets/schnapp/schnapp-passiver-wortschatz/audioFiles/EX10_File_128_Wortschatz_Instruktion_2MASTER.mp3');
  }

  resetAudio() {
    this.smartAudio.play('instruction10_1');
    this.initCheckBoxStyles();
  }

  playInstruction() {
    if (this.data.isAudioPlaying && !this.playingInstruction) {
      this.smartAudio.play('instruction10_2');
      this.playingInstruction = true;
    } else if (this.data.isAudioPlaying && this.playingInstruction) {
      this.smartAudio.stop('instruction10_2');
      this.playingInstruction = false;
    } else {
      this.smartAudio.play('instruction10_2');
      this.playingInstruction = true;
    }
    this.isAudioButtonVisible = true;
  }

  getPlayIcon(): string {
    return this.data.isAudioPlaying ? 'pause' : 'play';
  }

  nextPage() {
    this.back = false;
    if (this.currentItem >= 2) {
      var isCorrect = this.compare() ? Correct.Richtig : Correct.Falsch;
      this.lastAnswer = new Answer(this.currentItem - 1, this.items[this.currentItem].word, isCorrect)
      this.exercise.answers.push(this.lastAnswer)
    }
    this.lastIndexSelected = this.currentlySelected;
    this.currentlySelected = -1;
    if (this.currentItem + 1 === this.items.length) {
      this.finished();
      return;
    }
    this.currentItem++;
    this.initCheckBoxStyles();

    this.playAudio();
  }

  lastPage(){
    this.back = true;
    this.currentItem--;
    if (this.lastAnswer.correct === Correct.Richtig){
      this.exercise.sumCorrect--;
    }
    this.exercise.answers.pop()
    this.chooseImage(this.lastIndexSelected);
  }

  getSubTitle() {
    let str = 'Welches Bild passt zu \"' + this.items[this.currentItem].word + '\"?';
    if (this.currentItem >= this.nrOfExercises) {
      str = 'Durchgang ' + (this.currentItem - 1) + ' von '
      + (this.items.length - this.nrOfExercises)  + ': ' + str;
    } else {
      str = 'Übung ' + (this.currentItem + 1) + ' von ' + this.nrOfExercises + ': ' + str;
    }
    return str;
  }

  skipExercise() {
    this.finished();
  }

  finished() {
    var count = 0;
    this.exercise.answers.forEach(answer =>{              //calculate correct sumCorrect
        if(answer.correct == "Richtig"){
            count++;
        }
    })
    this.exercise.sumCorrect = count;

    this.exercise.finished = true;
    if (this.data.current_testset.title.toLowerCase().includes('grawo')) {
      this.data.result.endDate = new Date();
      this.data.result.finished = true;
      this.data.saveResult(false);
      this.router.navigate(['schnapp-passiver-wortschatz/summary']);
    } else {
      this.data.result.results.push(this.exercise);
      this.data.saveResult(false);
      this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
    }
  }

  playAudio() {
    this.playingInstruction = false;
    this.smartAudio.preload('audio' + this.currentItem, 'assets/schnapp/schnapp-passiver-wortschatz/audioFiles/' + this.items[this.currentItem].audio);
    this.smartAudio.play('audio' + this.currentItem);
    this.initCheckBoxStyles();
    this.currentlySelected = -1;
  }

  isExercise() {
    return this.currentItem < this.nrOfExercises;
  }

  initCheckBoxStyles() {
    this.checkBoxStyles = ['', '', '', ''];
}

  chooseImage(index: number) {
    this.currentlySelected = index;
    this.initCheckBoxStyles();
    this.checkBoxStyles[this.currentlySelected] = 'borderSelected';

    if (this.isExercise) {
      setTimeout(() => {
        this.compare();
      }, AppConfig.TimeoutTutorialFeedback);

    }
  }

  nextPageAllowed(){
    if (this.isExercise()){
      return this.checkBoxStyles.join('').includes('borderCorrected');
    }
    return this.checkBoxStyles.join('').includes('borderSelected');
  }

  compare() {
    if (this.isExercise()) {
      this.checkBoxStyles[this.items[this.currentItem].correctIndex] = 'borderCorrected';
    } else {
      if (this.currentlySelected === this.items[this.currentItem].correctIndex) {
        this.exercise.sumCorrect++;
        return true;
      }
    }
    return false;
  }
}
