import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import { timeInterval } from 'rxjs/operators';
import { DebugModeComponent } from 'src/app/common-components/debug-mode/debug-mode.component';
import {DataService} from 'src/app/services/data.service';

@Component({
  selector: 'app-lv-map-start',
  templateUrl: './lv-map-start.page.html',
  styleUrls: ['./lv-map-start.page.scss'],
})
export class LvMapStartPage implements OnInit {

  mapCssClass: String = '';
  currentAudio = '';
  timer = null;
  elapsedSeconds = 0;
  arrowVisible = false;
  debugMode = new DebugModeComponent();
  introSilben = true;
  nextExerciseRoute = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public smartAudio: SmartAudioService,
    public data: DataService
  ) {
  }

  ngOnInit() {
    this.mapCssClass = 'mapForest';
    if(this.data.result !== undefined){
      this.nextExerciseRoute = this.data.getNextExerciseRoute('lv-map-start');
      if(this.nextExerciseRoute == 'lv-silben'){
        this.smartAudio.preload('story1', 'assets/lernverlauf/audios/L1_Silben/Geschichte_Silben.mp3');
      }
      else{
        this.introSilben = false;
        this.smartAudio.preload('story1', 'assets/lernverlauf/audios/L1_Wortlesen/Anfangsgeschichte_Lesen.mp3');
      }
    }
    else{
      this.nextExerciseRoute = 'lv-silben';
      this.smartAudio.preload('story1', 'assets/lernverlauf/audios/L1_Silben/Geschichte_Silben.mp3');
    }

    this.timer = setInterval(v => {
      this.elapsedSeconds++;
      this.trigger();
    }, 1000);
  }

  trigger() {
    if(this.elapsedSeconds == 2){
      this.smartAudio.play('story1');
      this.currentAudio = 'story1';
    }  
    else if(this.elapsedSeconds == 55 && this.introSilben){
      this.arrowVisible = true;
      clearInterval(this.timer);
    }  
    else if(this.elapsedSeconds == 66 && !this.introSilben){
      this.arrowVisible = true;
      clearInterval(this.timer);
    }
  }

  goToNextPage() {
    this.smartAudio.audioPlayer.pause();
    this.router.navigate([this.nextExerciseRoute]);
  }
}
