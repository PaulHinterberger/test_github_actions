import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraLeVSentenceConfig } from 'src/app/classes/config/GraLeVSentenceConfig';
import { Answer, Correct } from 'src/app/classes/exercises/Answer';
import { ExerciseGraLeVSentence } from 'src/app/classes/exercises/exerciseGraLeVSentence';
import { GraLeVAnswer } from 'src/app/classes/exercises/gralevAnswer';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-exercise-sentence',
  templateUrl: './exercise-sentence.page.html',
  styleUrls: ['./exercise-sentence.page.scss'],
})
export class ExerciseSentencePage implements OnInit {
  
  wordCount = 0;
  correct = 0;
  corrects: boolean[] = [];
  selectedWords: string[]=[];
  textCounter=0;
  checkBoxColor = ['', '', '', ''];
  selectedAnswer = -1;
  progressbarValue = 0;
  currentSecond = 0;
  public showWords = 0;
  words: GraLeVSentenceConfig[];
  selected = -1;
  numberOfWords: number;
  remainingTime = '03:00';
  timeLimitSeconds = 180;
  navigateToNextPage = false;
  timeLim=3;
  exercise = new ExerciseGraLeVSentence();
    timer = null;
    timerSubscription: Subscriber<number>;

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient) {
  }

  ngOnInit() {
    this.exercise.route = 'exercise-sentence';
    this.data.setExerciseProperties(this.exercise);
    if(this.data.current_testset.title.toLowerCase() === 'gralev 5'){
      this.timeLimitSeconds = 120;
      this.timeLim=2;
    }
    this.sourceLoader.get('assets/gralev/satzEbene/satzebene.csv', {responseType: 'text'})
        .subscribe(data => {
            const exerciseConfig = data.split('\n').splice(1);
            //this.numberOfWords = exerciseConfig.length;
            //console.log(exerciseConfig.map(item => item.split(';')));
            this.words = exerciseConfig
                .map(item => item.split(';'))
                .map(item => new GraLeVSentenceConfig(
                    'assets/gralev/satzEbene/' + item[0],
                    [item[2], item[3], item[4], item[5]],
                    item[1]
                    ));
            //console.log(this.words);
        });
    /* setTimeout(() => {
        this.startExercise();
    }, 1000); */
  }

  isDisabled(){
      if(this.textCounter===0||this.textCounter===3){
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
    this.getAnswers();
    if (this.data.result !== undefined) {
        this.data.result.results.push(this.exercise);
        //console.log(this.data.result);
        this.data.saveResult(false);
    }
    this.router.navigate(['gralev-third-text'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  getAnswers(){
    
    for (let i = 2; i < this.words.length-1; i++) {     // Last value in words was undefined...
      var isCorrect = this.corrects[i-2] ? Correct.Richtig : Correct.Falsch;
      this.exercise.gralevAnswers.push(new GraLeVAnswer(i-1, this.words[i].correct, this.selectedWords[i-2] === null ? '' : this.selectedWords[i-2], isCorrect));
    } 
  }

  check() {

    this.navigateToNextPage = false;
    this.initCheckBoxColors();
    //console.log(`words length:  ${this.words.length}`);
    //console.log(`wordCount:  ${this.wordCount}`);

    const selectedWord = this.selectedAnswer > -1 ? this.words[this.wordCount].words[this.selectedAnswer]: '';
    const correctWord = this.words[this.wordCount].correct;
    // console.log(`Selected word length: ${selectedWord.length}`);
    // console.log(`---${selectedWord}---`);
    // console.log(`Correct word length: ${correctWord.length}`);
    // console.log(`---${correctWord}---`);
    if (this.wordCount === 2) {
        this.startTimer();
    }
    if(this.isInstruction() === false){
      if(this.wordCount > 1){
        if (selectedWord === correctWord) {
            this.correct++;
            this.corrects.push(true);
            console.log("true");
        }
        else{
            this.corrects.push(false);
            console.log("false");
        }
        this.selectedWords.push(selectedWord);
      }
      this.selectedAnswer=-1;
      this.selected = -1;

      if (this.wordCount === this.words.length-2) {
          this.nextPage();
      } else{
          this.wordCount++;
      }
    }
    this.textCounter++;
    // this.stateChange();
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
          console.log(answer);
          this.selected=0;
          this.selectedAnswer = answer;
          this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
          this.navigateToNextPage = true;
      }
  }

  tutorialFeedback() {
      if(this.wordCount===0){
        this.checkBoxColor[0] = 'borderCorrected';
      }
      else{
        this.checkBoxColor[3] = 'borderCorrected';
      }
      this.navigateToNextPage = true;
  }

  initCheckBoxColors() {
      this.checkBoxColor = ['', '', '', ''];
  }

  getRemainingTime() {
      return new Date((this.timeLimitSeconds - this.currentSecond) * 1000).toISOString().substr(14, 5);
  }
  startTimer() {
    if (this.timer === null){
        this.timer = interval(500);

        this.timerSubscription = this.timer.subscribe((halfSeconds) => {
          this.progressbarValue = halfSeconds / 650 * this.timeLimitSeconds;
          // console.log(this.progressbarValue);

          if (halfSeconds % 2 === 0) {
              this.currentSecond = halfSeconds / 2;
              if (this.currentSecond === this.timeLimitSeconds) {
                this.timerSubscription.unsubscribe();
                  console.log(this.nextPage());
              }
          }
      });
    }
  }
}
