import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { AppConfig } from 'src/app/classes/config/AppConfig';
import { LesenConfig } from 'src/app/classes/config/LesenConfig';
import { Correct, GraLeVAnswer } from 'src/app/classes/exercises/gralevAnswer';
import { LvLesenExercise } from 'src/app/classes/exercises/lvLesenExercise';
import { DebugModeComponent } from 'src/app/common-components/debug-mode/debug-mode.component';
import { DataService } from 'src/app/services/data.service';
import { SmartAudioService } from 'src/app/services/smart-audio.service';

@Component({
  selector: 'app-lv-lesen-nominal',
  templateUrl: './lv-lesen-nominal.page.html',
  styleUrls: ['./lv-lesen-nominal.page.scss'],
})
export class LvLesenNominalPage implements OnInit {
  tutorialCount = 0;
  wordCount = 0;
  correct = 0;
  progressbarValue = 0;
  currentSecond = 0;
  public showWords = false;
  words: LesenConfig[];
  /* selectedWords: GraLeVAnswer[]=[]; */
  numberOfWords: number;
  remainingTime = '03:00';
  timeLimitSeconds = 180;
  skippedExercise = false;
  checkBoxColor = ['', '', '', ''];
  selectedAnswer = 0;
  navigateToNextPage = false;
  exercise = new LvLesenExercise();
  exerciseFinished = false;
  private debugMode = new DebugModeComponent();
  //introWord = new LesenConfig("assets/lernverlauf/02-lesen/88_nase.png", ["Hose", "Dose", "Name", "Nase"], "Nase");
  introWord = new LesenConfig("assets/lernverlauf/02-lesen/Nominalgruppen/die_grossen_Ohren.png", ["die grünen Ohren", "der große Ofen", "der grüne Ofen", "die großen Ohren"], "die großen Ohren");

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient,
      public smartAudio: SmartAudioService) {
  }

  ngOnInit() {    
      this.exercise.route = 'lv-lesen-nominal';
      this.data.setExerciseProperties(this.exercise);
      this.initAudio();
      if(this.data.result === undefined){
          this.exercise.configFile = "assets/lernverlauf/02-lesen/NGr_lesen_passiv.csv";
      }
      else{
          this.exercise.configFile = this.data.getExerciseByRoute('lv-lesen-nominal').configFile;
      }
      this.sourceLoader.get(this.exercise.configFile, {responseType: 'text'})
          .subscribe(data => {
              // console.log(data);
              const exerciseConfig = data.split('\n').splice(1);
              this.numberOfWords = exerciseConfig.length+1;
              this.words = exerciseConfig
                  .map(item => item.split(';'))
                  .map(item => new LesenConfig(
                      item[0],
                      [item[2], item[3], item[4], item[5]],
                      item[1]
                  ));
              //console.log(this.numberOfWords);
              this.words.push(new LesenConfig("", [], ""));
              this.words.unshift(this.introWord);
              //console.log(this.words);
              setTimeout(() => {
                  this.startExercise();
              }, 1000);
          });
  }

  initAudio() {
      this.smartAudio.preload('lesen-instr', 'assets/lernverlauf/audios/L1_Wortlesen/File_86_Wortlesen_Instruktion.mp3');
    //   this.smartAudio.preload('audio10', 'assets/lernverlauf/audios/L1_Wortlesen/Wortlesen_Aufgabe_1.mp3');
      // for (let index = 1; index <= 71; index++) {
      //     this.smartAudio.preload('audio' + index, 'assets/lernverlauf/audios/L1_Wortlesen/Wortlesen_Aufgabe_' + index + '.mp3');
      // }
  }

  isTutorial() {
      return this.tutorialCount === 0;
  }

  skipExercise() {
      this.skippedExercise = true;
      this.nextPage();
  }

  initCheckBoxColors() {
      this.checkBoxColor = ['', '', '', ''];
  }

  nextPage() {
      //console.log("hallo");
      if(!this.exerciseFinished){
          this.exerciseFinished = true;
          //this.selectedWords.push(new GraLeVAnswer(0, "Zeitmessung", this.getRemainingTime() + " Minuten", null));
          //console.log(this.selectedWords);
          this.fillDict();
          this.exercise.finished = true;
          this.exercise.sumCorrect = this.correct;
          if (this.data.result !== undefined) {
              this.data.result.results.push(this.exercise);
              this.data.saveResult(false);

          }
          this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
      }        
  }

  fillDict(){
    for (; this.wordCount < this.words.length - 1; this.wordCount++) {     // Last value in words was undefined...
        //console.log(this.words[this.wordCount]);
        this.exercise.dict[this.words[this.wordCount].correct] = null;            
    }
      /* for (let i = 0; i < this.selectedWords.length; i++) {     // Last value in words was undefined...
          // console.log(this.words[this.wordCount]);
          this.exercise.gralevAnswers.push(this.selectedWords[i]);            
      } */
  }

  check(word: string) {
      this.navigateToNextPage = false;
      this.initCheckBoxColors();
      if (word === this.words[this.wordCount].correct && this.wordCount !== 0) {
          this.correct++;
          this.exercise.dict[this.words[this.wordCount].correct] = true;
        //   this.selectedWords.push(new GraLeVAnswer(this.wordCount+1, word, this.words[this.wordCount].correct, Correct.Richtig));
      } else if (this.wordCount !== 0) {
        this.exercise.dict[this.words[this.wordCount].correct] = false;
        //   this.selectedWords.push(new GraLeVAnswer(this.wordCount+1, word, this.words[this.wordCount].correct, Correct.Falsch));
      }
      //console.log(this.wordCount + ' ' + this.words[this.wordCount].correct + ' Auswahl: ' + word + ' => ' + this.correct + ' richtig');
      
      this.wordCount++;
      this.selectedAnswer = -1;

      //console.log(this.wordCount + " === " + this.numberOfWords)
      if (this.wordCount === this.numberOfWords) {
          this.nextPage();
      } else {
          this.stateChange();
          if (this.wordCount === 1) {
              this.startTimer();
          }
      }
  }

  stateChange() {
      // console.log('hide');
      this.showWords = false;
      if (this.wordCount <= 2) {
          this.smartAudio.play('lesen-instr');
      }
      const delay = this.wordCount <= 2 ? 2000 : 1000;
      setTimeout(() => {
          // console.log('show');
          if (this.wordCount === 0) {
            //   this.smartAudio.play('audio10');
              setTimeout(() => {
                  if (this.wordCount === 0) {
                      this.tutorialFeedback();
                  }
              }, 7000);
          }
          this.showWords = true;
      }, delay);

  }

  startExercise() {
      // this.smartAudio.preload('Jetzt', 'assets/lernverlauf/audios/L1_Wortlesen/Jetzt_du.mp3');
      // this.smartAudio.play('Jetzt');
      this.tutorialCount = 1;
      this.stateChange();
      // this.startTimer();
  }

  selectAnswer(answer: number) {
      if (this.wordCount === 0) {
          this.selectedAnswer = answer;
          this.initCheckBoxColors();
          this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
          this.navigateToNextPage = false;
          setTimeout(val => {
              this.tutorialFeedback();
          }, AppConfig.TimeoutTutorialFeedback);
      } else {
          this.initCheckBoxColors();
          // console.log(answer);
          this.selectedAnswer = answer;
          this.checkBoxColor[this.selectedAnswer] = 'borderSelected';
          this.navigateToNextPage = true;
      }
  }

  tutorialFeedback() {
      this.checkBoxColor[3] = 'borderCorrected';
      this.navigateToNextPage = true;
  }

  getRemainingTime() {
      /* if(this.exercise.configFile.includes("NGr_lesen_passiv.csv")){
          return new Date((this.currentSecond) * 1000).toISOString().substr(14, 5);
      } */
      return new Date((this.timeLimitSeconds - this.currentSecond) * 1000).toISOString().substr(14, 5);
  }

  startTimer() {
      const timer = interval(500);

      const sub = timer.subscribe((halfSeconds) => {
          this.progressbarValue = halfSeconds / 650 * this.timeLimitSeconds;
          // console.log(this.progressbarValue);
          if (this.skippedExercise === true) {
              sub.unsubscribe();
          }
          if (halfSeconds % 2 === 0) {
              this.currentSecond = halfSeconds / 2;
              /* if(this.exercise.configFile.includes("NGr_lesen_passiv.csv")){
                  if (this.currentSecond === this.timeLimitSeconds) {
                      this.selectedWords.push(new GraLeVAnswer(0, "Zeitmessung", "3:00 Minuten", null));
                  }
              }
              else{ */
                  if (this.currentSecond === this.timeLimitSeconds) {
                      sub.unsubscribe();
                      this.nextPage();
                  }
            //   }
          }
      });
  }
}
