import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraDigSubtest3Config, GraDigSubtestConfig } from 'src/app/classes/config/GraDigSubtestConfig';
import { Correct } from 'src/app/classes/exercises/Answer';
import { GraDigAnswer } from 'src/app/classes/exercises/gradigAnswer';
import { GraDigSubtestExercise } from 'src/app/classes/exercises/gradigSubtestExercise';
import { DataService } from 'src/app/services/data.service';
import { SmartAudioService } from 'src/app/services/smart-audio.service';

@Component({
  selector: 'app-subtest3',
  templateUrl: './subtest3.page.html',
  styleUrls: ['./subtest3.page.scss'],
})
export class Subtest3Page implements OnInit {
  exercise = new GraDigSubtestExercise();

  // item-config
  words: GraDigSubtest3Config[] = [];
  wordCount = 0;
  textCounter = 0;

  // results
  rightAnswerCount = 0;
  corrects: boolean[] = [];
  selectedWords: string[]=[];

  // check button state
  nextDisabled = false;

  // drag-and-drop
  firstAnswersBox: string[] = [];
  secondAnswersBox: string[] = [];
  thirdAnswersBox: string[] = [];
  draggedItem: string;
  answerBoxColor = ['item-dropped', 'item-dropped', 'item-dropped'];

  // timer
  timer = null;
  timerSubscription: Subscriber<number>;
  currentSecond = 0;
  remainingTime = '03:00';
  timeLimitSeconds = 180;
  correctWords: string[] = [];
  times=new Array<string>();

  constructor(
    public router: Router,
    public data: DataService,
    public sourceLoader: HttpClient,
    public smartAudio: SmartAudioService) {}

  ngOnInit() {
    this.exercise.route = 'subtest3';
    this.data.setExerciseProperties(this.exercise);
    this.initAudio();
    this.stateChanged();
    this.sourceLoader.get('assets/gradig/subtest3/subtest3.csv', {responseType: 'text'})
      .subscribe(data => {
        const exerciseConfig = data.split('\n').splice(1);
        this.words = exerciseConfig
            .map(item => item.split(';'))
            .map(item => new GraDigSubtest3Config(
                [item[0], item[1], item[2]], [item[3]]
                ));
        // console.log(this.words);
      });
  }

  initAudio(){
      this.smartAudio.replaceSound('instr', 'assets/gradig/audio/5_Instru3.mp3');
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

  nextPage() {
    this.timerSubscription.unsubscribe();
    /* if(this.currentSecond===this.timeLimitSeconds){
      this.checkAction();
    } */
    this.exercise.finished = true;
    this.exercise.sumCorrect = this.rightAnswerCount;
    this.exercise.timeOverall=this.getTime();
    this.storeAnswers();
    if (this.data.result !== undefined) {
        this.data.result.results.push(this.exercise);
        //console.log(this.data.result);
        this.data.saveResult(false);
    }
    this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
  }

  storeAnswers(){
    //this.getCorrectWords();
    for (let i = 0; i < this.words.length-1; i++) {     // Last value in words was undefined...
      var isCorrect = this.corrects[i] ? Correct.Richtig : Correct.Falsch;
      //console.log(isCorrect);
      this.exercise.gradigAnswers.push(
        new GraDigAnswer(
          i+1, 
          this.correctWords[i], 
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

  getCorrectWords(){
    for (let i = 0; i < this.words.length; i++) {
      this.correctWords.push(this.words[i].correct[0]);
    }
  }

  isAnswerComplete() {
    // check if any required answerbox is empty
    // console.log(`isAnswerComplete? textCounter = ${this.textCounter}`);
    if(this.textCounter > 0 && this.textCounter < 3 || this.textCounter > 3){
      if ((this.firstAnswersBox.length == 0)  &&
          (this.secondAnswersBox.length == 0) &&
          (this.thirdAnswersBox.length == 0)) {
          return false;
      }
    }
    return true;
  }

  checkAction(){
    // console.log('checkAction');

    // check if any required answerbox is empty
    if (this.firstAnswersBox == [] &&
        this.secondAnswersBox == [] &&
        this.thirdAnswersBox == []) {
        //console.log('Error itembox empty!');
        return;
    }
    if (this.firstAnswersBox.length!==0 &&
      this.secondAnswersBox.length===0 &&
      this.thirdAnswersBox.length===0){
        this.correctWords.push(this.firstAnswersBox[0]);
      // check if answer is correct
      //console.log("firstanswerbox");
      if (this.firstAnswersBox[0] === this.words[this.wordCount].answers[0]) {
        this.rightAnswerCount++;
        this.corrects.push(true);
        //console.log(this.corrects);
      }
      else{
        this.corrects.push(false);
        //console.log(this.corrects);
      } 
      this.selectedWords.push(this.words[this.wordCount].answers[0]);
    }
    else if (this.firstAnswersBox.length===0 &&
      this.secondAnswersBox.length!==0 &&
      this.thirdAnswersBox.length===0){
        this.correctWords.push(this.secondAnswersBox[0]);
        //console.log("secondanswerbox");
      // check if answer is correct
      if (this.secondAnswersBox[0] === this.words[this.wordCount].answers[1]) {
        this.rightAnswerCount++;
        this.corrects.push(true);
        //console.log(this.corrects);
      }
      else{
        this.corrects.push(false);
        //console.log(this.corrects);
      } 
      this.selectedWords.push(this.words[this.wordCount].answers[1]);
    }
    else if (this.firstAnswersBox.length===0 &&
      this.secondAnswersBox.length===0 &&
      this.thirdAnswersBox.length!==0){
        this.correctWords.push(this.thirdAnswersBox[0]);
        //console.log("thirdanswerbox");
      // check if answer is correct
      if (this.thirdAnswersBox[0] === this.words[this.wordCount].answers[2]) {
        this.rightAnswerCount++;
        this.corrects.push(true);
        //console.log(this.corrects);
      }
      else{
        this.corrects.push(false);
        //console.log(this.corrects);
      } 
      this.selectedWords.push(this.words[this.wordCount].answers[2]);
      //console.log(this.corrects);
    }
    this.times.push(this.getTime());
    /* console.log(this.times);
    console.log("correctwords - "+this.correctWords);
    console.log("selectedwords - "+this.selectedWords); */
  }

  checkAnswer() {
    // console.log(`checkAnswer: wordCount == ${this.wordCount} textCounter = ${this.textCounter}`);
    if (this.wordCount === 2) {
      this.startTimer();
    }   
    if (this.isInstruction() === false){            
      this.checkAction();
      if (this.wordCount === this.words.length - 2) {
        this.nextPage();
      } else {       
        this.wordCount++;
        this.resetBoxes();       
      }
    }
    this.textCounter++;
    this.stateChanged();
    this.initColors();
    this.nextDisabled = !this.isInstruction(); // === true ? false : true;
  }

  isInstruction(){
    if (this.textCounter === 0 || this.textCounter === 3){
      return true;
    }
    return false;
  }

  initColors(){
    //console.log("Grundeinstellung");
    this.answerBoxColor=['item-dropped', 'item-dropped', 'item-dropped'];
  }

  resetBoxes(){
    this.firstAnswersBox = [];
    this.secondAnswersBox = [];
    this.thirdAnswersBox = [];
  }

  getTime() {
    return new Date((this.currentSecond) * 1000).toISOString().substr(14, 5);
  }

  startTimer() {
   //console.log("startTimer");
   if (this.timer === null){
      this.timer = interval(500);
      this.timerSubscription = this.timer.subscribe((halfSeconds) => {
        // console.log(halfSeconds);
        if (halfSeconds % 2 === 0) {
          this.currentSecond = halfSeconds / 2;
          
        }
      });
      // console.log(this.timerSubscription);
    }
  }

  cdkDragStarted(event: CdkDragDrop<string[]>, item: string){
     //console.log(item);
    this.draggedItem = item;
  }

  dropToToolbox(event: CdkDragDrop<string[]>) {
    console.log('dropped back to toolbox');
  }

  isAnswerBoxEmpty(answerbox:number){
    //console.log('isAnswerBoxEmpty');
    switch (answerbox) {
      case 0:
        return true;
      case 1:
        if(this.firstAnswersBox.length===1)
          return false;
        return true;
      case 2:
        if(this.secondAnswersBox.length===1)
          return false;
        return true;
      case 3:
        if(this.thirdAnswersBox.length===1)
          return false;
        return true;
      default:
        break;
    }
  }

  drop(event: CdkDragDrop<string[]>, answerbox:number) {
    //console.log(`dropped ${answerbox}`);
    if(this.isAnswerBoxEmpty(answerbox)){
      
      if(event.previousContainer !== event.container){
        transferArrayItem(event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex);
      } else {
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }
      this.nextDisabled = this.isAnswerComplete() === false;
      this.setAnswerBoxColors(answerbox - 1);
    }
    //console.log(this.thirdAnswersBox);
    //console.log(this.secondAnswersBox);
    //console.log(this.firstAnswersBox);
  }

  setAnswerBoxColors(answerBox: number){
    if (this.wordCount >= 2){
      this.initColors();
      return;
    }
    setTimeout(() => {
        //console.log(`check answerbox ${answerBox + 1}`);
        switch (answerBox) {
          case 0:
            if(this.firstAnswersBox.length===0){
              this.answerBoxColor[0]='item-dropped';
            }
            else if(this.firstAnswersBox[0]===this.words[this.wordCount].answers[0]){
              this.answerBoxColor[0]='correct';
            }
            else{
              this.answerBoxColor[0]='notCorrect';
            }
            break;
          case 1:
            if(this.secondAnswersBox.length===0){
              this.answerBoxColor[1]='item-dropped';
            }
            else if(this.secondAnswersBox[0]===this.words[this.wordCount].answers[1]){
              this.answerBoxColor[1]='correct';
            }
            else{
              this.answerBoxColor[1]='notCorrect';
            }
            break;
          case 2:
            if(this.thirdAnswersBox.length===0){
              this.answerBoxColor[2]='item-dropped';
            }
            else if(this.thirdAnswersBox[0]===this.words[this.wordCount].answers[2]){
              this.answerBoxColor[2]='correct';
            }
            else{
              this.answerBoxColor[2]='notCorrect';
            }
            break;
          default:
            break;
        }        

    }, 1000);

  }
}
