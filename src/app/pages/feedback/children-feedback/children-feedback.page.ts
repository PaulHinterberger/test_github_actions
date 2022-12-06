import { Component, OnInit } from '@angular/core';
import { FeedbackExercise, FeedbackResultConfig } from 'src/app/classes/exercises/feedbackExercise';
import { FeedbackConfig } from 'src/app/classes/config/FeedbackConfig';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { HttpClient } from '@angular/common/http';
import { SmartAudioService } from 'src/app/services/smart-audio.service';

@Component({
  selector: 'app-children-feedback',
  templateUrl: './children-feedback.page.html',
  styleUrls: ['./children-feedback.page.scss'],
})
export class ChildrenFeedbackPage implements OnInit {

  wordCount = 0;
    correct = 0;
    progressbarValue = 0;
    currentSecond = 0;
    words: FeedbackConfig[]=[
      new FeedbackConfig("Max‘ Lehrerin stellt eine Frage an die Klasse. Max kann oft nicht warten, bis er an der Reihe ist und schreit die Antwort einfach raus. Ist das bei dir auch so?",""),
      new FeedbackConfig("Lara fällt es oft schwer, sich nach dem Spielen wieder auf die Aufgaben zu konzentrieren. Sie ist dann ganz unaufmerksam und kann nicht richtig aufpassen. Ist das bei dir auch so?",""),
      new FeedbackConfig("Wenn Max beim Turnen abgeworfen wird und ausscheidet, bleibt er ganz ruhig und wartet bis er wieder mitspielen kann. Ist das bei dir auch so?",""),
      new FeedbackConfig("Lara quatscht recht gerne mit anderen Kindern, dreht sich oft um, steht häufig auf. Sie lenkt mit ihrem Verhalten die anderen in der Klasse ab. Ist das bei dir auch so?",""),
      new FeedbackConfig("Max bekommt den neuen Wochenplan. Seine Lehrerin muss nichts zu ihm sagen. Er beginnt gleich mit den Aufgaben und wird mit allen Aufgaben fertig. Ist das bei dir auch so?",""),
      new FeedbackConfig("Laras Tisch ist sehr ordentlich und aufgeräumt. Sie packt alles in die Schultasche ein, was sie für die Hausübung braucht. Sie vergisst nie etwas. Ist das bei dir auch so?",""),
    ];
    exercise = new FeedbackExercise();
  selectedAnswers: FeedbackConfig[]=[];
  instruction=1;
  currentAudioItem: number;
  isNextDisabled:boolean=false;
  buttoncolor=['buttonred', 'buttonyellow', 'buttongreen'];
    

    constructor(
        public router: Router,
        public data: DataService,
        public sourceLoader: HttpClient,
        public smartAudio: SmartAudioService) {
    }

    ngOnInit() {    
        this.exercise.route = 'feedback';
        this.data.setExerciseProperties(this.exercise);
        this.initAudio();
        this.smartAudio.play('instr');
    }

    initAudio() {
      this.smartAudio.preload('instr', 'assets/feedback/audio/Einleitung_Erklaerung.mp3');
        this.smartAudio.preload('audio0', 'assets/feedback/audio/Frage1.mp3');
        this.smartAudio.preload('audio1', 'assets/feedback/audio/Frage2.mp3');
        this.smartAudio.preload('audio2', 'assets/feedback/audio/Frage3.mp3');
        this.smartAudio.preload('audio3', 'assets/feedback/audio/Frage4.mp3');
        this.smartAudio.preload('audio4', 'assets/feedback/audio/Frage5.mp3');
        this.smartAudio.preload('audio5', 'assets/feedback/audio/Frage6.mp3');
        this.smartAudio.preload('end', 'assets/feedback/audio/Dank_am_Ende.mp3');
        // for (let index = 1; index <= 71; index++) {
        //     this.smartAudio.preload('audio' + index, 'assets/lernverlauf/audios/L1_Wortlesen/Wortlesen_Aufgabe_' + index + '.mp3');
        // }
    }

    getPlayIcon(): string {
      return this.data.isAudioPlaying ? 'pause' : 'play';
    }

    playAudio() {
      switch (this.instruction) {
        case 1: {
            this.smartAudio.play('instr');
            break;
        }
        default: {
            this.smartAudio.play('audio' + this.wordCount);
            break;
        }
    }
    }


    nextPage() {
        this.exercise.finished=true;
        this.storeAnswer();
        if (this.data.result !== undefined) {
            this.data.result.results.push(this.exercise);
            //console.log(this.data.result);
            this.data.saveResult(false);
        }
        this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
    }
    storeAnswer(){
      for (let i = 0; i < this.selectedAnswers.length; i++) {
        this.exercise.answers.push(new FeedbackResultConfig(this.selectedAnswers[i].question, this.selectedAnswers[i].selected));
      }
    }

    nextAnswer(){
      if(this.instruction===1){
        this.smartAudio.play('instr');
        this.instruction=0;
      }
      else{
        this.buttoncolor=['buttonred', 'buttonyellow', 'buttongreen'];
        this.selectedAnswers.push(this.words[this.wordCount]);
        // console.log(this.selectedAnswers);
        this.wordCount++;
      }
      if (this.wordCount === this.words.length) {
        this.nextPage();
      }
      this.isNextDisabled=true;
      this.playAudio();
    }

    save(answer:number) {
      this.isNextDisabled=false;
      switch (answer) {
        case 0:
          this.buttoncolor=['buttonredselected', 'buttonyellow', 'buttongreen'];
          this.words[this.wordCount].selected = 'nein';
          // console.log("nein");
          break;
        case 1:
          this.buttoncolor=['buttonred', 'buttonyellowselected', 'buttongreen'];
          this.words[this.wordCount].selected = 'manchmal';
          // console.log("manchmal");
          break;
        case 2:
          this.buttoncolor=['buttonred', 'buttonyellow', 'buttongreenselected'];
          this.words[this.wordCount].selected = 'ja';
          // console.log("ja");
          break;
        default:
          this.buttoncolor=['buttonred', 'buttonyellow', 'buttongreen'];
          break;
      } 
    }
}
