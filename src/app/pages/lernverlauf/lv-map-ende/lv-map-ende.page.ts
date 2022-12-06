import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from "../../../services/smart-audio.service";
import { DebugModeComponent } from '../../../common-components/debug-mode/debug-mode.component';
@Component({
  selector: 'app-lv-map-ende',
  templateUrl: './lv-map-ende.page.html',
  styleUrls: ['./lv-map-ende.page.scss'],
})
export class LvMapEndePage implements OnInit {
  mapCssClass: String = '';
  arrowVisible = false;
  timer = null;
  elapsedSeconds = 0;
  debugMode = new DebugModeComponent();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public data: DataService,
    public smartAudio: SmartAudioService
  ) {
  }

  ngOnInit() {
    this.mapCssClass = 'mapForest';
    this.smartAudio.preload('story4', 'assets/lernverlauf/audios/L1_Wortschreiben/File_203_Wortschreiben_Geschichte.mp3');
    this.smartAudio.play('story4');
    this.timer = setInterval(v => {
      this.elapsedSeconds++;
      this.trigger();
    }, 800);
  }

  trigger() {
    switch (this.elapsedSeconds) {
      case 20: this.arrowVisible = true; clearInterval(this.timer); break;
      default: break;
    }
  }

  goToNextPage() {
    this.smartAudio.audioPlayer.pause();
    // this.router.navigate(['lv-schreiben-evaluation'], {fragment: 'lv-map-ende'});
    // console.log(this.data.result)
    if (this.data.result !== undefined) {
        this.router.navigate([this.data.getNextExerciseRoute('lv-map-ende')]);
    }
    else{
      this.router.navigate(['home']);
    }
  }
}
