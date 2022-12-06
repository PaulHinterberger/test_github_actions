import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedbackConnector } from 'src/app/classes/exercises/feedbackExercise';
import { DataService } from 'src/app/services/data.service';
import { SmartAudioService } from 'src/app/services/smart-audio.service';

@Component({
  selector: 'app-feedback-connector',
  templateUrl: './feedback-connector.page.html',
  styleUrls: ['./feedback-connector.page.scss'],
})
export class FeedbackConnectorPage implements OnInit {


  exercise = new FeedbackConnector();
    constructor(
        public router: Router,
        public data: DataService,
        public sourceLoader: HttpClient,
        public smartAudio: SmartAudioService) {
    }

    ngOnInit() {    
      this.exercise.route = 'feedback-connector';
      this.data.setExerciseProperties(this.exercise);
      this.initAudio();
      this.smartAudio.play('uebergang');
    }

    initAudio() {
      this.smartAudio.preload('uebergang', 'assets/feedback/audio/0_Uebergang_vom_Lesen.mp3');
    }

    getPlayIcon(): string {
      return this.data.isAudioPlaying ? 'pause' : 'play';
    }

    nextPage() {
      this.exercise.finished=true;
      if (this.data.result !== undefined) {
          //console.log(this.data.result);
          this.data.saveResult(false);
      }
      this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
    }

}
