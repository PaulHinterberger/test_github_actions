import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { DebugModeComponent } from '../../../common-components/debug-mode/debug-mode.component';
import {SmartAudioService} from '../../../services/smart-audio.service';
import {DataService} from 'src/app/services/data.service';
@Component({
  selector: 'app-lv-map-lesen',
  templateUrl: './lv-map-lesen.page.html',
  styleUrls: ['./lv-map-lesen.page.scss'],
})
export class LvMapLesenPage implements OnInit {
  mapCssClass: String = '';
  currentAudio = '';
  timer = null;
  elapsedSeconds = 0;
  arrowVisible = false;
  debugMode = new DebugModeComponent();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public smartAudio: SmartAudioService,
    public data: DataService
  ) {
  }

  ngOnInit() {
    this.mapCssClass = 'mapForest';
    
    this.smartAudio.preload('story2', 'assets/lernverlauf/audios/L1_Wortlesen/File_85_Wortlesen_Geschichte.mp3');

    this.timer = setInterval(v => {
      this.elapsedSeconds++;
      this.trigger();
    }, 1000);
  }

  trigger() {
    switch (this.elapsedSeconds) {
      case 2: this.smartAudio.play('story2'); this.currentAudio = 'story2'; break;
      case 41: this.arrowVisible = true; clearInterval(this.timer); break;
      default: break;
    }
  }

  goToNextPage() {
    this.smartAudio.audioPlayer.pause();
    this.router.navigate([this.data.getNextExerciseRoute('lv-map-lesen')]);
  }
}
