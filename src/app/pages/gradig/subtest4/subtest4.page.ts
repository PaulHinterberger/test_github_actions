import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscriber } from 'rxjs';
import { GraDigHistoryPartConfig, GraLeVTextConfig, HistoryPartConfig } from 'src/app/classes/config/GraLeVTextConfig';
import { Correct } from 'src/app/classes/exercises/Answer';
import { GraDigAnswer } from 'src/app/classes/exercises/gradigAnswer';
import { GraDigSubtestExercise } from 'src/app/classes/exercises/gradigSubtestExercise';
import { DataService } from 'src/app/services/data.service';
import { SmartAudioService } from 'src/app/services/smart-audio.service';
//import { MatSelectIcon } from '@angular-material-extensions/select-icon';

@Component({
  selector: 'app-subtest4',
  templateUrl: './subtest4.page.html',
  styleUrls: ['./subtest4.page.scss'],
})
export class Subtest4Page implements OnInit {
  historyCount = 0;
  wordCount = 0;
  correct = 0;
  corrects: boolean[] = [];
  selectedWords: string[]=[];
  textCounter=0;
  currentSecond = 0;
  public showWords = 0;
  words: GraLeVTextConfig[]=[];
  historyParts: GraDigHistoryPartConfig[];
  color=['', '', ''];
  numberOfWords: number;
  remainingTime = '01:40';
  timeLimitSeconds = 100;

  times=new Array<string>();
  exercise = new GraDigSubtestExercise();
  
  timer = null;
  timerSubscription: Subscriber<number>;

  //icons: MatSelectIcon[] = [];

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient,
      public smartAudio: SmartAudioService) {
  }

  ngOnInit() {
    this.exercise.route = 'subtest4';
    this.data.setExerciseProperties(this.exercise);
    this.initAudio();
    this.stateChanged();
      this.sourceLoader.get('assets/gradig/subtest4/subtest4.csv', {responseType: 'text'})
          .subscribe(data => {
              const exerciseConfig = data.split('\n').splice(1);
              this.numberOfWords = exerciseConfig.length;
              this.words = exerciseConfig
                  .map(item => item.split(';'))
                  .map(item => new GraLeVTextConfig(
                      Number.parseInt(item[5]),
                      Number.parseInt(item[4]),
                      [item[0], item[1], item[2]],
                      item[3]
                      ));
              //console.log(this.words);
          });
        this.sourceLoader.get('assets/gradig/subtest4/historyParts.csv', {responseType: 'text'})
          .subscribe(data => {
              const exerciseConfig = data.split('\n').splice(1);
              this.numberOfWords = exerciseConfig.length;
              this.historyParts = exerciseConfig
                  .map(item => item.split(';'))
                  .map(item => new GraDigHistoryPartConfig(
                    Number.parseInt(item[0]),
                    item[1],
                    Number.parseInt(item[2]),
                    Number.parseInt(item[3])
                  ));
              //console.log(this.historyParts);
          });
  }

  onItem(i:number, word:string){
    this.words[i].selected = word;
  }
/* 
  initSelectList(){
    this.icons=[
      {
        url: 'assets/icons/circle_black_24dp.svg',
        value: 'kreis'
      },
      {
        url: 'assets/icons/star_black_24dp.svg',
        value: 'stern'
      },
      {
        url: 'assets/icons/stop_black_24dp.svg',
        value: 'stop'
      }
    ]
  }

  onIconSelected(selectedIcon: MatSelectIcon) {
    console.log('selected icon');
  } */

  initAudio(){
      this.smartAudio.replaceSound('instr', 'assets/gradig/audio/6_Instru4.mp3');
      this.smartAudio.replaceSound('instr2', 'assets/gradig/audio/3_nachBesp.mp3');
  }

  stateChanged(){
    if(this.textCounter===0){
      this.smartAudio.play('instr');
    }
    if(this.textCounter===2){
      this.smartAudio.play('instr2');
    }
  }

  counter(i:number){
    return new Array(i);
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
    for (let i = count; i < this.getHistoryWordsLength(this.historyCount); i++) {
      if(this.words[i].selected !== ''){
        isSelectedCount++;
      }
    }
    //console.log(isSelectedCount);
    return isSelectedCount===5?true:false;
  }

  countControl(count:number){
    if(count===5){
      return true;
    }
    return false
    /* switch (this.historyCount-1) {
      case 0:
        if(count === 5)
          return true;
        return false;
      case 1:
        if(count === 10)
          return true;
        return false;
      case 2:
        if(count === 15)
          return true;
        return false;
      case 3:
        if(count === 20)
          return true;
        return false;
      case 4:
        if(count === 25)
          return true;
        return false;
      case 5:
        if(count === 30)
          return true;
        return false;
      default:
        return false;
    } */
  }
  
  isDisabled(){
    if(this.isInstruction()){
      return false;
    }
    if(this.isSelected()){
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
    this.router.navigate(['gralev-first-text'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }
  getAnswers(){
    for (let i = 0; i < this.words.length; i++) {     // Last value in words was undefined...
      var isCorrect = this.corrects[i] ? Correct.Richtig : Correct.Falsch;
      this.exercise.gradigAnswers.push(
        new GraDigAnswer(
          i+1, 
          this.words[i].correctAnswer, 
          this.selectedWords[i]===null ? '' : this.selectedWords[i], 
          this.times[i] === null ? '' : this.getCurrentTime(i), 
          isCorrect));
    }
  }
  getCurrentTime(i: number): string {
    if(this.times[i]==='' || this.times[i]===null){
      return this.times[i];
    } 
    else{
      // console.log("current time - " + this.times[i]);
      // console.log("current seconds - " + this.times[i].split(":")[1]);
      /* if(i<4)
        return this.times[i]; */
      if(i===4){
        return this.times[i];
      }
      // console.log("foreign seconds - " + this.times[i-5].split(":")[1]);
      return new Date(
        (Number.parseInt(this.times[i].split(":")[1]) - Number.parseInt(this.times[i-5].split(":")[1])) * 1000)
        .toISOString().substr(14, 5);
    }
  }

  getHistoryWordsLength(count : number){
    switch (count) {
      case 0:
        return 5;
      case 1:
        return 10;
      case 2:
        return 15;
      case 3:
        return 20;
      case 4:
        return 25;
      case 5:
        return 30;
      default:
        break;
    }
  }

  getHistoryPartsByCount(){
    const partsToReturn : GraDigHistoryPartConfig[]=[];
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
    //console.log("textcounter befor - " + this.textCounter);
    setTimeout(() => {
    }, 1000);
    if (this.historyCount === 1) {
      this.startTimer();
    }
    if(!this.isInstruction()){
      //console.log("textcounter after - " + this.textCounter);
      //console.log("checkaction");
      this.checkAction();
    }
    if (this.historyCount === 6) {
      this.nextPage();
    }
    this.textCounter++;
    this.stateChanged();
  }

  checkAction(){
    const count=this.wordCount;
    for (let i = count; i < this.getHistoryWordsLength(this.historyCount); i++) {
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
      //console.log(this.selectedWords);
      this.wordCount++;
    }
    this.times.push('', '', '', '', this.getTime());
    //console.log(this.times);
    this.historyCount++;
    //console.log(this.historyCount);
  }

  isInstruction(){
    if (this.textCounter === 0 || this.textCounter === 2){
      return true;
    }
    return false;
  }

  getTime() {
      return new Date((this.currentSecond) * 1000).toISOString().substr(14, 5);
  }
  startTimer() {
    if (this.timer === null){
      this.timer = interval(500);
      this.timerSubscription = this.timer.subscribe((halfSeconds) => {
        if (halfSeconds % 2 === 0) {
          this.currentSecond = halfSeconds / 2;
        }
      });
    }
  }
}
