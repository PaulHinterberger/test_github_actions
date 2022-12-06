import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackConfig } from 'src/app/classes/config/FeedbackConfig';
import { AdultFeedbackExercise, FeedbackResultConfig, LanguageConfig } from 'src/app/classes/exercises/feedbackExercise';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-adult-feedback',
  templateUrl: './adult-feedback.page.html',
  styleUrls: ['./adult-feedback.page.scss'],
})
export class AdultFeedbackPage implements OnInit {
  wordCount = 0;
  correct = 0;
  progressbarValue = 0;
  currentSecond = 0;
  words: LanguageConfig[]=[
    new LanguageConfig("(1) Welche Sprachen sprichst du?", "", ['nur Deutsch', 'nur andere Sprache(n)', 'Deutsch und andere Sprache(n)']),
    new LanguageConfig("(2) Welche Sprache sprichst du besser?", "", ['Deutsch', 'andere Sprache', 'beide gleich gut']),
    new LanguageConfig("(3) Welche Sprache sprichst du öfter?", "", ['Deutsch', 'andere Sprache', 'beide gleich oft']),
    new LanguageConfig("(4.1) In meiner Familie sprechen wir", "", ['meist Deutsch', 'meist andere Sprache', 'beide gleich']),
    new LanguageConfig("(4.2) Meine Mutter spricht mit mir", "", ['meist Deutsch', 'meist andere Sprache', 'beide gleich']),
    new LanguageConfig("(4.3) Mein Vater spricht mit mir", "", ['meist Deutsch', 'meist andere Sprache', 'beide gleich']),
    new LanguageConfig("(4.4) Ich spreche mit meiner Mutter", "", ['meist Deutsch', 'meist andere Sprache', 'beide gleich']),
    new LanguageConfig("(4.5) Mit den Geschwistern spreche ich", "", ['meist Deutsch', 'meist andere Sprache', 'beide gleich']),
    new LanguageConfig("(5) Welche Sprache sprichst du lieber?", "", ['Deutsch', 'andere Sprache', 'beide gleich gerne'])
    ];
  exercise = new AdultFeedbackExercise();
selectedAnswers: LanguageConfig[]=[];
instruction=1;
currentAudioItem: number;
isNextDisabled:boolean=false;
buttoncolor=['notselected', 'notselected', 'notselected'];
  

  constructor(
      public router: Router,
      public data: DataService,
      public sourceLoader: HttpClient) {
  }

  ngOnInit() {    
      this.exercise.route = 'adult-feedback';
      this.data.setExerciseProperties(this.exercise);
  }


  nextPage() {
      this.exercise.finished=true;
      this.storeAnswer();
      if (this.data.result !== undefined) {
          this.data.result.results.push(this.exercise);
          //console.log(this.data.result);
          this.data.saveResult(false);
      }
      if(this.data.current_testset.exercises[1].route.includes('lv')){
        this.router.navigate(['lv-bereit']);
      }
      else{
        this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
      }
  }
  storeAnswer(){
    for (let i = 0; i < this.selectedAnswers.length; i++) {
      this.exercise.adultAnswers.push(new LanguageConfig(this.selectedAnswers[i].question, this.selectedAnswers[i].selected, this.selectedAnswers[i].answers));
    }
  }

  lastAnswer(){
    this.wordCount--;
    this.selectedAnswers.splice(this.wordCount);
    this.initColor();
  }

  nextAnswer(){
    this.selectedAnswers.push(this.words[this.wordCount]);
    this.initColor();
    console.log(this.selectedAnswers);
    if(this.wordCount === 0 && this.selectedAnswers[0].selected==='nur Deutsch'){
      this.nextPage();
    }
    else{
      this.wordCount++;
      if (this.wordCount === this.words.length) {
        this.nextPage();
      }
      this.isNextDisabled=true;
    }
  }

  save(answer:number, selectedText:string) {
    this.isNextDisabled=false;
    switch (answer) {
      case 0:
        this.buttoncolor=['selected', 'notselected', 'notselected'];
        this.words[this.wordCount].selected = selectedText;
        console.log(selectedText);
        break;
      case 1:
        this.buttoncolor=['notselected', 'selected', 'notselected'];
        this.words[this.wordCount].selected = selectedText;
        console.log(selectedText);
        break;
      case 2:
        this.buttoncolor=['notselected', 'notselected', 'selected'];
        this.words[this.wordCount].selected = selectedText;
        console.log(selectedText);
        break;
      default:
        this.buttoncolor=['notselected', 'notselected', 'notselected'];
        break;
    } 
    this.nextAnswer();
  }

  initColor(){
    this.buttoncolor=['notselected', 'notselected', 'notselected'];
  }

}
