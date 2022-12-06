import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraLeVTextConfig, HistoryPartConfig } from 'src/app/classes/config/GraLeVTextConfig';
import { Answer, Correct } from 'src/app/classes/exercises/Answer';
import { ExerciseGraLeVText } from 'src/app/classes/exercises/exerciseGraLeVText';
import { GraLeVAnswer } from 'src/app/classes/exercises/gralevAnswer';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-exercise-text',
  templateUrl: './exercise-text.page.html',
  styleUrls: ['./exercise-text.page.scss'],
})
export class ExerciseTextPage implements OnInit {
  historyCount = 0;
  wordCount = 0;
  correct = 0;
  corrects: boolean[] = [];
  selectedWords: string[]=[];
  textCounter=0;
  currentSecond = 0;
  public showWords = 0;
  words: GraLeVTextConfig[]=[];
  historyParts: HistoryPartConfig[];
  color=['', '', ''];
  numberOfWords: number;
  remainingTime = '01:40';
  timeLimitSeconds = 100;
  exercise = new ExerciseGraLeVText();
  historyTitle=["Warum ist unser Planet blau?", "Was sind Nutztiere?", "Wie entsteht Tomatensoße?"]
  
  timer = null;
  timerSubscription: Subscriber<number>;

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient) {
  }

  ngOnInit() {
    this.exercise.route = 'exercise-text';
    this.data.setExerciseProperties(this.exercise);
      this.sourceLoader.get('assets/gralev/mazeEbene/mazeEbene.csv', {responseType: 'text'})
          .subscribe(data => {
              const exerciseConfig = data.split('\n').splice(1);
              this.numberOfWords = exerciseConfig.length;
              this.words = exerciseConfig
                  .map(item => item.split(';'))
                  .map(item => new GraLeVTextConfig(
                      Number.parseInt(item[0]),
                      Number.parseInt(item[1]),
                      [item[3], item[4], item[5]],
                      item[2]
                      ));
              //console.log(this.words);
          });
        this.sourceLoader.get('assets/gralev/mazeEbene/historyParts.csv', {responseType: 'text'})
          .subscribe(data => {
              const exerciseConfig = data.split('\n').splice(1);
              this.numberOfWords = exerciseConfig.length;
              this.historyParts = exerciseConfig
                  .map(item => item.split(';'))
                  .map(item => new HistoryPartConfig(
                      item[0],
                      Number.parseInt(item[1]),
                      Number.parseInt(item[2]),
                      Number.parseInt(item[3])
                      ));
              //console.log(this.historyParts);
          });
  }

  getColor(answer:number){
    if(this.words[answer].selected===this.words[answer].correctAnswer){
      this.color[answer]='correct';
    }
    else{
      this.color[answer]='notCorrect';
    }
  }

  isSelected(){
    let isSelectedCount=0;
    const count=this.wordCount;
    for (let i = 0; i < this.getHistoryWordsLength(this.historyCount); i++) {
      if(this.words[i].selected !== ''){
        isSelectedCount++;
      }
    }
    //console.log(isSelectedCount);
    return this.countControl(isSelectedCount);
  }

  countControl(count:number){
    switch (this.historyCount) {
      case 0:
        if(count === 3)
          return true;
        return false;
      case 1:
        if(count === 18)
          return true;
        return false;
      case 2:
        if(count === 33)
          return true;
        return false;
      default:
        return false;
    }
  }
  
  isDisabled(){
    if(this.textCounter === 0 || this.textCounter === 2){
      return false;
    }
    if(this.isSelected()){
      return false;
    }
    return true;
}

  nextPage() {
    this.timerSubscription.unsubscribe();
    if(this.currentSecond===this.timeLimitSeconds){
      this.checkAction();
    }
    this.exercise.finished=true;
    this.exercise.sumCorrect=this.correct;
    this.getAnswers();
    if (this.data.result !== undefined) {
        this.data.result.results.push(this.exercise);
        //console.log(this.data.result);
        this.data.saveResult(false);
    }
    this.router.navigate(['gralev-end-text'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }
  getAnswers(){
    for (let i = 3; i < this.words.length; i++) {     // Last value in words was undefined...
      var isCorrect = this.corrects[i] ? Correct.Richtig : Correct.Falsch;
      this.exercise.gralevAnswers.push(new GraLeVAnswer(i-2, this.words[i].correctAnswer, this.selectedWords[i]===null ? '' : this.selectedWords[i], isCorrect));
    }
  }

  getHistoryWordsLength(count : number){
    switch (count) {
      case 0:
        return 3;
        case 1:
          return 18;
          case 2:
        return 33;
      default:
        break;
    }
  }

  getHistoryPartsByCount(){
    const partsToReturn : HistoryPartConfig[]=[];
    for (let index = 0; index < this.historyParts.length; index++) {
      if(this.historyParts[index].historyNr === this.historyCount+1){
        //console.log(this.historyParts[index]);
        partsToReturn.push(this.historyParts[index]);
      }
    }
    //console.log(partsToReturn);
    return partsToReturn;
  }

  check() {
    //console.log(this.historyCount);
    setTimeout(() => {
    }, 1000);
    if (this.historyCount === 1) {
      this.startTimer();
    }
    if(this.textCounter === 1 || this.textCounter === 3 || this.textCounter === 4){
      this.checkAction();
    }
    this.textCounter++;
    if (this.historyCount === 3) {
        this.nextPage();
    }
  }

  checkAction(){
    const count=this.wordCount;
    for (let i = count; i < this.getHistoryWordsLength(this.historyCount); i++) {
      if(i > 2){
        if(this.words[i].selected === this.words[i].correctAnswer){
          this.correct++;
          this.corrects.push(true);
          //console.log(this.corrects);
          //console.log(this.correct);
        }
        else{
          this.corrects.push(false);
          //console.log(this.corrects);
        }
        this.selectedWords.push(this.words[i].selected);
      }
      //console.log(this.selectedWords);
      this.wordCount++;
    }
    this.historyCount++;
    //console.log(this.historyCount);
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
