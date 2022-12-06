import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import { DebugModeComponent } from 'src/app/common-components/debug-mode/debug-mode.component';
import {SmartAudioService} from "src/app/services/smart-audio.service";
import {DataService} from 'src/app/services/data.service';

@Component({
  selector: 'app-lv-map-schreiben',
  templateUrl: './lv-map-schreiben.page.html',
  styleUrls: ['./lv-map-schreiben.page.scss'],
})
export class LvMapSchreibenPage implements OnInit {
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
    this.smartAudio.preload('story3', 'assets/lernverlauf/audios/L1_Wortschreiben/File_160_Wortschreiben_Geschichte.mp3');
    this.smartAudio.play('story3');
    this.currentAudio = 'story3';

    this.timer = setInterval(v => {
      this.elapsedSeconds++;
      this.trigger();
    }, 1000);
  }

  trigger() {
    switch (this.elapsedSeconds) {
      case 30: this.arrowVisible = true; clearInterval(this.timer); break;
      default: break;
    }
  }

  goToNextPage() {
    this.smartAudio.audioPlayer.pause();
    this.router.navigate([this.data.getNextExerciseRoute('lv-map-schreiben')]);
  }
}
