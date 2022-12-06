import {StopWatchService} from 'src/app/services/stop-watch.service';
import {DataService} from 'src/app/services/data.service';
import {SchnappBenennenExercise} from 'src/app/classes/exercises/schnappBenennenExercise';
import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-benennen-a',
  templateUrl: './schnapp-benennen-a.page.html',
  styleUrls: ['./schnapp-benennen-a.page.scss'],
})
export class SchnappBenennenAPage implements OnInit {
  exerciseFinished = false;
  exercise = new SchnappBenennenExercise();
  headline = 'Übungsblatt RAN1 vorgeben';
  imageArray = [];
  booleanArray = [];
  public timeBegan = null;
  public timeStopped: any = null;
  public blankTime = '00:00';
  public time = '00:00';
  public stoppedDuration: any = 0;
  public started = null;
  public running = false;
  public currentImages = [];
  clickCount = 0;
  isCardActive = false;
  playedInstruction = false;
  counter = 0;
  text = 'START';
  isDisabled = true;
  toggle = true;
  status = 'Enable';
  private debugMode = new DebugModeComponent();


  // tslint:disable-next-line: max-line-length
  constructor(public smartAudio: SmartAudioService, public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.exerciseFinished = false;
    });
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-benennen-a';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.sounds = [];
    this.smartAudio.preload('instruction7a_1', 'assets/schnapp/schnapp-benennen/audioFiles/EX7a_File_78_RAN1_Instruktion_1MASTER.mp3');
    this.smartAudio.preload('instruction7a_2', 'assets/schnapp/schnapp-benennen/audioFiles/File_88-89_NEU.mp3');
    this.smartAudio.preload('instruction7a_3', 'assets/schnapp/schnapp-benennen/audioFiles/File_89_NEU.mp3');
    this.smartAudio.play('instruction7a_2');
    this.sourceLoader.get('assets/schnapp/schnapp-benennen/stringResources/orderImages.csv', {responseType: 'text'})
      .subscribe(data => {
        this.imageArray = data.split('\n').splice(1);
        this.currentImages = this.imageArray.splice(0, 5);
        this.booleanArray = new Array(5);
        if (this.imageArray.length === 0) {
          alert('No data found. Redirecting to evaluation page. Test will be resumed');
          this.finished();
        }
      });
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  isExercise(){
    return this.headline.includes('Übung');
  }

  nextPage() {
    if (this.headline.includes('Übung')) {
      this.smartAudio.preload('instruction7a_4', 'assets/schnapp/schnapp-benennen/audioFiles/File_90_NEU-89_ALT.mp3');
      this.smartAudio.play('instruction7a_4');
      this.headline = '';
      this.loadAllImages();
      this.clickCount = 0;
      this.playedInstruction = false;
    } else {
      this.startStop();
      this.clickCount = 0;
      this.finished();
    }
  }

  skipExercise() {
    this.finished();
  }

  finished(){
    this.exercise.timePictures = this.time;
    this.exercise.finished = false;                 // Exercise 7b to be done
    if(this.data.result !== undefined){
      this.data.result.results.push(this.exercise);
      this.data.saveResult(false);
    }
    this.router.navigate(['schnapp-benennen-b']);
  }

  resetAudio() {
    if (this.headline.includes('Übung')) {
      this.smartAudio.play('instruction7a_2');
    } else {
      this.smartAudio.play('instruction7a_3');
    }
    this.clickCount = 0;
  }

  loadAllImages() {
    this.currentImages = this.imageArray;
    this.booleanArray = new Array(this.currentImages.length);
  }

  chooseImage(index: number) {
    this.booleanArray[index] = !this.booleanArray[index];
    if (!this.headline.includes('Übung')) {
      this.booleanArray[index] === true ? this.exercise.sumFalsePictures++ : this.exercise.sumFalsePictures--;
    }
  }

  startStop() {
    this.toggle = !this.toggle;
    this.status = this.toggle ? 'Enable' : 'Disable';
    switch (this.counter) {
      case 0:
        if (this.running) {
          return;
        }
        if (this.timeBegan === null) {
          this.isDisabled = false;
          this.reset();
          this.timeBegan = new Date();
        }
        if (this.timeStopped !== null) {
          const newStoppedDuration: any = (+new Date() - this.timeStopped);
          this.stoppedDuration = this.stoppedDuration + newStoppedDuration;

        }
        this.started = setInterval(this.clockRunning.bind(this), 10);
        this.running = true;
        this.counter = 1;
        this.text = 'STOP';
        break;
      case 1:
        this.running = false;
        this.timeStopped = new Date();
        clearInterval(this.started);
        this.counter = 0;
        this.text = 'START';
    }
  }
  exerciseIsFinished(){
      return !this.running && this.time !== '00:00';
  }

  reset() {
    this.running = false;
    clearInterval(this.started);
    this.stoppedDuration = 0;
    this.timeBegan = null;
    this.timeStopped = null;
    this.time = this.blankTime;
    this.loadAllImages();
  }

  clockRunning() {
    const currentTime: any = new Date();
    const timeElapsed: any = new Date(currentTime - this.timeBegan - this.stoppedDuration);
    const hour = timeElapsed.getUTCHours();
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();
    const ms = timeElapsed.getUTCMilliseconds();
    this.time =
      this.zeroPrefix(min, 2) + ':' +
      this.zeroPrefix(sec, 2);
  }

  zeroPrefix(num: string, digit: number) {
    let zero = '';
    for (let i = 0; i < digit; i++) {
      zero += '0';
    }
    return (zero + num).slice(-digit);
  }

  getPlayIcon() {
    if (this.data.isAudioPlaying && this.playedInstruction) {
      return 'pause';
    } else {
      return 'play';
    }
  }
}
