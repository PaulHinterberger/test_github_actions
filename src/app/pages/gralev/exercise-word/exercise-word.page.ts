import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraLeVWortConfig } from 'src/app/classes/config/GraLeVWortConfig';
import { ExerciseGraLeVWord } from 'src/app/classes/exercises/exerciseGraLeVWord';
import { DataService } from 'src/app/services/data.service';
import {CdkDragDrop, copyArrayItem, transferArrayItem, moveItemInArray} from '@angular/cdk/drag-drop';
import { Answer, Correct } from 'src/app/classes/exercises/Answer';
import { GraLeVAnswer } from 'src/app/classes/exercises/gralevAnswer';

@Component({
  selector: 'app-exercise-word',
  templateUrl: './exercise-word.page.html',
  styleUrls: ['./exercise-word.page.scss'],
})
export class ExerciseWordPage implements OnInit {

  exercise = new ExerciseGraLeVWord();

  // item-config
  words: GraLeVWortConfig[] = [];
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
  timeLim=3;
  timer = null;
  timerSubscription: Subscriber<number>;
  currentSecond = 0;
  remainingTime = '03:00';
  timeLimitSeconds = 180;
  correctWords: string[] = [];

  constructor(
    public router: Router,
    public data: DataService,
    public sourceLoader: HttpClient) {}

  ngOnInit() {
    this.exercise.route = 'exercise-word';
    this.data.setExerciseProperties(this.exercise);
    if(this.data.current_testset.title.toLowerCase() === 'gralev 5'){
      this.timeLimitSeconds = 120;
      this.timeLim=2;
    }
    this.sourceLoader.get('assets/gralev/wortEbene/Wortebene.csv', {responseType: 'text'})
      .subscribe(data => {
        const exerciseConfig = data.split('\n').splice(1);
        this.words = exerciseConfig
            .map(item => item.split(';'))
            .map(item => new GraLeVWortConfig(
                'assets/gralev/wortEbene/' + item[0],
                'assets/gralev/wortEbene/' + item[1], 
                'assets/gralev/wortEbene/' + item[2], 
                [item[6], item[7], item[8], item[9], item[10], item [11]],
                item[3],item[4], item[5]
                ));
        // console.log(this.words);
      });
  }

  nextPage() {
    this.timerSubscription.unsubscribe();
    if(this.currentSecond===this.timeLimitSeconds){
      this.checkAction();
    }
    this.exercise.finished = true;
    this.exercise.sumCorrect = this.rightAnswerCount;
    this.storeAnswers();
    if (this.data.result !== undefined) {
        this.data.result.results.push(this.exercise);
        //console.log(this.data.result);
        this.data.saveResult(false);
    }
    this.router.navigate(['gralev-second-text'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  storeAnswers(){
    this.getCorrectWords();
    for (let i = 0; i < this.correctWords.length; i++) {     // Last value in words was undefined...
      var isCorrect = this.corrects[i] ? Correct.Richtig : Correct.Falsch;
      this.exercise.gralevAnswers.push(new GraLeVAnswer(i+1, this.correctWords[i], this.selectedWords[i] === null ? '' : this.selectedWords[i], isCorrect));
    }
  }

  getCorrectWords(){
    for (let i = 2; i < this.words.length; i++) {
      this.correctWords.push(this.words[i].correct1, this.words[i].correct2, this.words[i].correct3);
    }
  }

  isAnswerComplete() {
    // check if any required answerbox is empty
    // console.log(`isAnswerComplete? textCounter = ${this.textCounter}`);
    if(this.textCounter > 1 && this.textCounter < 4 || this.textCounter > 4){
      if ((this.firstAnswersBox.length == 0)  ||
          (this.secondAnswersBox.length == 0) ||
          (this.thirdAnswersBox.length == 0)) {
          return false;
      }
    }
    return true;
  }

  checkAction(){
    // console.log('checkAction');

    // check if any required answerbox is empty
    if (this.firstAnswersBox == [] ||
        this.secondAnswersBox == [] ||
        this.thirdAnswersBox == []) {
        //console.log('Error itembox empty!');
        return;
    }
    if(this.wordCount > 1){
      // check if answer is correct
      if (this.firstAnswersBox[0] === this.words[this.wordCount].correct1) {
        this.rightAnswerCount++;
        this.corrects.push(true);
        //console.log(this.corrects);
      }
      else{
        this.corrects.push(false);
        //console.log(this.corrects);
      } 
      if (this.secondAnswersBox[0] === this.words[this.wordCount].correct2) {
        this.rightAnswerCount++;
        this.corrects.push(true);
        //console.log(this.corrects);
      }
      else{
        this.corrects.push(false);
        //console.log(this.corrects);
      } 
      if (this.thirdAnswersBox[0] === this.words[this.wordCount].correct3) {
        this.rightAnswerCount++;
        this.corrects.push(true);
        //console.log(this.corrects);
      }
      else{
        this.corrects.push(false);
        //console.log(this.corrects);
        //console.log(this.thirdAnswersBox[0]);
      }
      this.selectedWords.push(this.firstAnswersBox[0], this.secondAnswersBox[0], this.thirdAnswersBox[0]);
      //console.log(this.selectedWords);
    }
  }

  checkAnswer() {
    // console.log(`checkAnswer: wordCount == ${this.wordCount} textCounter = ${this.textCounter}`);
    if (this.wordCount === 2) {
      this.startTimer();
    }   
    if (this.isInstruction() === false){            
      this.checkAction();
      if (this.wordCount === this.words.length - 1) {
        this.nextPage();
      } else {       
        this.wordCount++;
        this.resetBoxes();       
      }
    }
    this.textCounter++;
    this.initColors();
    this.nextDisabled = !this.isInstruction(); // === true ? false : true;
  }

  isInstruction(){
    if (this.textCounter === 0 || this.textCounter === 1 || this.textCounter === 4){
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

  getRemainingTime() {
    return new Date((this.timeLimitSeconds - this.currentSecond) * 1000).toISOString().substr(14, 5);
  }

  startTimer() {
   //console.log("startTimer");
   if (this.timer === null){
      this.timer = interval(500);
      this.timerSubscription = this.timer.subscribe((halfSeconds) => {
        // console.log(halfSeconds);
        if (halfSeconds % 2 === 0) {
          this.currentSecond = halfSeconds / 2;
          if (this.currentSecond === this.timeLimitSeconds) {
            this.timerSubscription.unsubscribe();
            this.nextPage();
          }
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
            else if(this.firstAnswersBox[0]===this.words[this.wordCount].correct1){
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
            else if(this.secondAnswersBox[0]===this.words[this.wordCount].correct2){
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
            else if(this.thirdAnswersBox[0]===this.words[this.wordCount].correct3){
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

