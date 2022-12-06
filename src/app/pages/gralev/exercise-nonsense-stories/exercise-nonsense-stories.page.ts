import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraLeVNonsenseStoryConfig } from 'src/app/classes/config/GraLeVNonsenseStoryConfig';
import { Answer, Correct } from 'src/app/classes/exercises/Answer';
import { ExerciseGraLeVNonsenseStory } from 'src/app/classes/exercises/exerciseGraLeVNonsenseStory';
import { GraLeVAnswer } from 'src/app/classes/exercises/gralevAnswer';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-exercise-nonsense-stories',
  templateUrl: './exercise-nonsense-stories.page.html',
  styleUrls: ['./exercise-nonsense-stories.page.scss'],
})
export class ExerciseNonsenseStoriesPage implements OnInit {
  wordCount = 0;
  correct = 0;
  corrects: boolean[] = [];
  selectedWords: string[]=[];
  textCounter=0;
  checkBoxColor1 = ['', '', '', ''];
  selectedAnswer1 = 0;
  checkBoxColor2 = ['', '', '', ''];
  selectedAnswer2 = 0;
  progressbarValue = 0;
  currentSecond = 0;
  words: GraLeVNonsenseStoryConfig[];
  selected1 = -1;
  selected2 = -1;
  numberOfWords: number;
  remainingTime = '03:00';
  timeLimitSeconds = 180;
  timer = null;
  timeLim=3;
  timerSubscription: Subscriber<number>;
  exercise = new ExerciseGraLeVNonsenseStory();
  correctWords: string[]=[];

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient) {
  }

  ngOnInit() {
    this.exercise.route = 'exercise-nonsense-stories';
    this.data.setExerciseProperties(this.exercise);
    if(this.data.current_testset.title.toLowerCase() === 'gralev 5'){
      this.timeLimitSeconds = 120;
      this.timeLim=2;
    }
      this.sourceLoader.get('assets/gralev/geschichtenEbene/geschichtenEbene.csv', {responseType: 'text'})
          .subscribe(data => {
              const exerciseConfig = data.split('\n').splice(1);
              this.numberOfWords = exerciseConfig.length;
              this.words = exerciseConfig
                  .map(item => item.split(';'))
                  .map(item => new GraLeVNonsenseStoryConfig(
                      item[0],
                      [item[2], item[3], item[4], item[5]],
                      [item[7], item[8], item[9], item[10]],
                      item[1],
                      item[6]
                      ));
              //console.log(this.words);
          });
  }

  isDisabled(){
    if(this.textCounter===0||this.textCounter===2){
        return false;
    }
    if(this.selected1>-1&&this.selected2>-1){
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
    this.router.navigate(['gralev-fourth-text'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  getAnswers(){
    this.getCorrectWords();
    for (let i = 0; i < this.correctWords.length; i++) {     // Last value in words was undefined...
      var isCorrect = this.corrects[i] ? Correct.Richtig : Correct.Falsch;
      this.exercise.gralevAnswers.push(new GraLeVAnswer(i+1, this.correctWords[i], this.selectedWords[i] === null ? '' : this.selectedWords[i], isCorrect));
    }
  }

  getCorrectWords(){
    for (let i = 1; i < this.words.length-1; i++) {
      this.correctWords.push(this.words[i].correctAnswer1, this.words[i].correctAnswer2);
    }
  }

  initCheckBoxColors(question:number) {
    if(question===0)
      this.checkBoxColor1 = ['', '', '', ''];
    else
      this.checkBoxColor2 = ['', '', '', ''];
  }


  check() {
    this.initCheckBoxColors(0);
    this.initCheckBoxColors(1);
    //console.log(this.words[this.wordCount].correctAnswer1);
    //console.log(this.words[this.wordCount].correctAnswer2);
    //console.log(this.textCounter);
    console.log('wordcount = ' + this.wordCount);
      if (this.wordCount === 1) {
        this.startTimer();
      }
    if(this.textCounter===0||this.textCounter===2){
      console.log('textcounter = ' + this.textCounter);
    }
    else{
      if(this.wordCount > 0){
        const selectedWord1 = this.selectedAnswer1 > -1 ? this.words[this.wordCount].answers1[this.selectedAnswer1]: '';
        const correctWord1 = this.words[this.wordCount].correctAnswer1;
        const selectedWord2 = this.selectedAnswer2 > -1 ? this.words[this.wordCount].answers2[this.selectedAnswer2]: '';
        const correctWord2 = this.words[this.wordCount].correctAnswer2;
        if (selectedWord1===correctWord1) {
          this.correct++;
          this.corrects.push(true);
          console.log("true");
        }
        else{
          this.corrects.push(false);
          console.log("false");
        }
        if (selectedWord2===correctWord2) {
          this.correct++;
          this.corrects.push(true);
          console.log("true");
        }
        else{
          this.corrects.push(false);
          console.log("false");
        }
        this.selectedWords.push(selectedWord1, selectedWord2);
      }
      this.wordCount++;
      this.selected1 = -1;
      this.selected2 = -1;
    }
    this.textCounter++;
    console.log('textcounter = ' + this.textCounter);
    if (this.wordCount === this.numberOfWords-1) {
        this.nextPage();
    }
  }

  selectAnswer(answer: number, question:number) {
    if (this.wordCount === 0) {
      if(question === 0){
        this.selectedAnswer1 = answer;
        this.selected1=0;
        this.initCheckBoxColors(0);
        this.checkBoxColor1[this.selectedAnswer1] = 'borderSelected';
      }
      else{
        this.selectedAnswer2 = answer;
        this.selected2=0;
        this.initCheckBoxColors(1);
        this.checkBoxColor2[this.selectedAnswer2] = 'borderSelected';
      }
      setTimeout(val => {
          if(question === 0){
            this.checkBoxColor1[3] = 'borderCorrected';
          }
          else{
            this.checkBoxColor2[0] = 'borderCorrected';
          }
      }, 1000);
    } else {
      if(question === 0){
        this.selectedAnswer1 = answer;
        this.selected1=0;
        this.initCheckBoxColors(0);
        this.checkBoxColor1[this.selectedAnswer1] = 'borderSelected';
      }
      else{
        this.selectedAnswer2 = answer;
        this.selected2=0;
        this.initCheckBoxColors(1);
        this.checkBoxColor2[this.selectedAnswer2] = 'borderSelected';
      }
    }
}

  getRemainingTime() {
      return new Date((this.timeLimitSeconds - this.currentSecond) * 1000).toISOString().substr(14, 5);
  }
  startTimer() {
    if (this.timer === null){
      this.timer = interval(500);
      this.timerSubscription = this.timer.subscribe((halfSeconds) => {
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
