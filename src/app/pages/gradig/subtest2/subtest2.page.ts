import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraDigSubtestConfig } from 'src/app/classes/config/GraDigSubtestConfig';
import { Correct, GraDigAnswer } from 'src/app/classes/exercises/gradigAnswer';
import { GraDigSubtestExercise } from 'src/app/classes/exercises/gradigSubtestExercise';
import { DataService } from 'src/app/services/data.service';
import { SmartAudioService } from 'src/app/services/smart-audio.service';

@Component({
  selector: 'app-subtest2',
  templateUrl: './subtest2.page.html',
  styleUrls: ['./subtest2.page.scss'],
})
export class Subtest2Page implements OnInit {
  wordCount = 0;
  correct = 0;
  corrects: boolean[] = [];
  selectedWords: string[]=[];
  textCounter=0;
  checkBoxColor = ['', '', ''];
  selectedAnswer = -1;
  progressbarValue = 0;
  currentSecond = 0;
  public showWords = 0;
  words: GraDigSubtestConfig[];
  selected = -1;
  numberOfWords: number;
  remainingTime = '03:00';
  timeLimitSeconds = 180;
  navigateToNextPage = false;
  exercise = new GraDigSubtestExercise();
    timer = null;
    timerSubscription: Subscriber<number>;
    times=new Array<string>();

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient,
      public smartAudio: SmartAudioService) {
  }

  ngOnInit() {
    this.exercise.route = 'subtest2';
    this.data.setExerciseProperties(this.exercise);
    this.initAudio();
    this.stateChanged();
    this.sourceLoader.get('assets/gradig/subtest2/subtest2.csv', {responseType: 'text'})
        .subscribe(data => {
            const exerciseConfig = data.split('\n').splice(1);
            //this.numberOfWords = exerciseConfig.length;
            //console.log(exerciseConfig.map(item => item.split(';')));
            this.words = exerciseConfig
                .map(item => item.split(';'))
                .map(item => new GraDigSubtestConfig(
                    [item[0], item[1], item[2]],
                    item[3]
                    ));
            //console.log(this.words);
        });
    /* setTimeout(() => {
        this.startExercise();
    }, 1000); */
  }

  initAudio(){
      this.smartAudio.replaceSound('instr', 'assets/gradig/audio/4_Instru2.mp3');
      this.smartAudio.replaceSound('instr2', 'assets/gradig/audio/3_nachBesp.mp3');
  }

  stateChanged(){
    if(this.textCounter===0){
      this.smartAudio.play('instr');
    }
    if(this.textCounter===3){
      this.smartAudio.play('instr2');
    }
  }

  isDisabled(){
      if(this.isInstruction()){
          return false;
      }
      if(this.selected>-1){
          return false;
      }
      return true;
  }

  nextPage() {
    this.timerSubscription.unsubscribe();
    this.exercise.finished=true;
    this.exercise.sumCorrect=this.correct;
    this.exercise.timeOverall=this.getTime();
    this.getAnswers();
    if (this.data.result !== undefined) {
        this.data.result.results.push(this.exercise);
        //console.log(this.data.result);
        this.data.saveResult(false);
    }
    this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
  }

  getAnswers(){
    
      for (let i = 0; i < this.words.length-1; i++) {     // Last value in words was undefined...
        var isCorrect = this.corrects[i] ? Correct.Richtig : Correct.Falsch;
        this.exercise.gradigAnswers.push(
          new GraDigAnswer(
            i+1, 
            this.words[i].correct, 
            this.selectedWords[i] === null ? '' : this.selectedWords[i], 
            this.times[i] === null ? '' : this.getCurrentTime(i), 
            isCorrect));
      } 
  }
  getCurrentTime(i: number): string {
    if(i===0) 
      return this.times[i];
    return new Date(
      ((Number.parseInt(this.times[i].split(":")[1]) - Number.parseInt(this.times[i-1].split(":")[1]))) * 1000)
      .toISOString().substr(14, 5);
  }

  check() {

    this.navigateToNextPage = false;
    this.initCheckBoxColors();
    //console.log(`words length:  ${this.words.length}`);
    //console.log(`wordCount:  ${this.wordCount}`);

    const selectedWord = this.selectedAnswer > -1 ? this.words[this.wordCount].answers[this.selectedAnswer]: '';
    const correctWord = this.words[this.wordCount].correct;
    // console.log(`Selected word length: ${selectedWord.length}`);
    // console.log(`---${selectedWord}---`);
    // console.log(`Correct word length: ${correctWord.length}`);
    // console.log(`---${correctWord}---`);
    if (this.wordCount === 2) {
        this.startTimer();
    }
    if(this.isInstruction() === false){
        if (selectedWord === correctWord) {
            this.correct++;
            this.corrects.push(true);
            //console.log("true");
        }
        else{
            this.corrects.push(false);
            //console.log("false");
        }
        this.times.push(this.getTime());
        //console.log(this.times);
        this.selectedWords.push(selectedWord);
        this.selectedAnswer=-1;
        this.selected = -1;

        if (this.wordCount === this.words.length-2) {
            this.nextPage();
        } else{
            this.wordCount++;
        }
    }
    this.textCounter++;
    this.stateChanged();
  }

  isInstruction(){
    if (this.textCounter === 0 || this.textCounter === 3){
      return true;
    }
    return false;
  }

  /* stateChange() {
    this.showWords = 0;
    // console.log('hide');
    if (this.wordCount === 0){
        setTimeout(() => {
            // console.log('show');
            this.showWords = 1;
        }, 1000);
    } else {
        setTimeout(() => {
            // console.log('show');
            this.showWords = 1;
        }, 1000);
    }
  } */

  /* startExercise() {
      this.stateChange();
      //this.startTimer();
  } */
  selectAnswer(answer: number) {
      if (this.wordCount === 0 || this.wordCount === 1) {
          this.selectedAnswer = answer;
          this.selected=0;
          this.initCheckBoxColors();
          this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
          this.navigateToNextPage = false;
          setTimeout(val => {
              this.tutorialFeedback();
          }, 1000);
      } else {
          this.initCheckBoxColors();
          //console.log(answer);
          this.selected=0;
          this.selectedAnswer = answer;
          this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
          this.navigateToNextPage = true;
      }
  }

  tutorialFeedback() {
      if(this.wordCount===0){
        this.checkBoxColor[2] = 'borderCorrected';
      }
      else{
        this.checkBoxColor[1] = 'borderCorrected';
      }
      this.navigateToNextPage = true;
  }

  initCheckBoxColors() {
      this.checkBoxColor = ['', '', ''];
  }

  getTime() {
      return new Date((this.currentSecond) * 1000).toISOString().substr(14, 5);
  }
  startTimer() {
    if (this.timer === null){
        this.timer = interval(500);

        this.timerSubscription = this.timer.subscribe((halfSeconds) => {
          this.progressbarValue = halfSeconds / 650 * this.timeLimitSeconds;
          // console.log(this.progressbarValue);

          if (halfSeconds % 2 === 0) {
              this.currentSecond = halfSeconds / 2;
          }
      });
    }
  }

}
