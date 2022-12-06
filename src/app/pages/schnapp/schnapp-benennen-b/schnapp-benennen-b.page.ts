import {StopWatchService} from 'src/app/services/stop-watch.service';
import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {HttpClient} from '@angular/common/http';
import {SchnappBenennenExercise} from 'src/app/classes/exercises/schnappBenennenExercise';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-benennen-b',
  templateUrl: './schnapp-benennen-b.page.html',
  styleUrls: ['./schnapp-benennen-b.page.scss'],
})
export class SchnappBenennenBPage implements OnInit {

  exercise: SchnappBenennenExercise;
  headline = 'Übungsblatt RAN2 vorgeben';
  numberArray = [];
  booleanArray = [];
  public timeBegan = null;
  public timeStopped: any = null;
  public stoppedDuration: any = 0;
  public started = null;
  public running = false;
  public blankTime = '00:00';
  public time = '00:00';
  public currentNumbers = [];
  isCardActive = false;
  clickCount = 0;
  nextPagePressed = false;
  playedInstruction = false;
  counter = 0;
  text = 'START';
  toggle = true;
  status = 'Enable';
  private debugMode = new DebugModeComponent();

  // tslint:disable-next-line: max-line-length
  constructor(public smartAudio: SmartAudioService, public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.nextPagePressed = false;
    });
    stopWatch.start();
  }

  ngOnInit() {
    this.smartAudio.preload('instruction7b_1', 'assets/schnapp/schnapp-benennen/audioFiles/EX7b_File_84_RAN2_Instruktion_1MASTER.mp3');
    this.smartAudio.preload('instruction7b_2', 'assets/schnapp/schnapp-benennen/audioFiles/File_94_NEU.mp3');
    this.smartAudio.play('instruction7b_2');
    if (this.data.result !== undefined) {
      this.exercise = this.data.getExerciseResultByRoute('schnapp-benennen-a') as SchnappBenennenExercise;
    } else {
      this.exercise = new SchnappBenennenExercise();
    }
    this.sourceLoader.get('assets/schnapp/schnapp-benennen/stringResources/orderNumbers.csv', {responseType: 'text'})
      .subscribe(data => {
        this.numberArray = data.split('\n').splice(1);
        this.currentNumbers = this.numberArray.splice(0, 5);
        this.booleanArray = new Array(5);
        if (this.numberArray.length === 0) {
          alert('No data found. Redirecting to evaluation page. Test will be resumed');
          this.finished();
        }
      });
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  resetAudio() {
    if (this.headline.includes('Übung')) {
      this.smartAudio.play('instruction7b_2');
    } else {
      this.smartAudio.play('instruction7b_3');
    }
    this.clickCount = 0;
  }

  isExercise(){
    return this.headline.includes('Übung');
  }

  exerciseIsFinished(){
    return !this.running && this.time !== '00:00';
  }
  
  nextPage() {
    if (this.headline.includes('Übung')) {
      this.smartAudio.preload('instruction7b_3', 'assets/schnapp/schnapp-benennen/audioFiles/File_87-89_ALT.mp3');
      this.smartAudio.preload('instruction7b_4', 'assets/schnapp/schnapp-benennen/audioFiles/EX7b_File_89_RAN2_Instruktion_6MASTER.mp3');
      this.smartAudio.play('instruction7b_3');
      this.headline = '';
      this.loadAllImages();
      this.clickCount = 0;
      this.playedInstruction = false;
    } else {
      this.startStop();
      this.clickCount = 0;
      this.nextPagePressed = true;
      this.finished();
    }
  }

  skipExercise() {
    this.finished();
  }

  finished(){
    this.stopWatch.stop();
    this.stopWatch.reset();
    this.exercise.timeNumbers = this.time;
    this.exercise.finished = true;
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  getPlayIcon() {
    if (this.data.isAudioPlaying && this.playedInstruction) {
      return 'pause';
    } else {
      return 'play';
    }
  }

  playInstructionAudio() {
    if (this.headline.includes('Übung')) {
      this.playedInstruction = true;
      this.smartAudio.play('instruction7b_2');
    } else {
      this.playedInstruction = true;
      this.smartAudio.play('instruction7b_4');
    }

  }

  loadAllImages() {
    this.currentNumbers = this.numberArray;
    this.booleanArray = new Array(this.currentNumbers.length);
  }

  chooseImage(index: number) {
    this.booleanArray[index] = !this.booleanArray[index];
    if (!this.headline.includes('Übung')) {
      this.booleanArray[index] === true ? this.exercise.sumFalseNumbers++ : this.exercise.sumFalseNumbers--;
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
    const min = timeElapsed.getUTCMinutes();
    const sec = timeElapsed.getUTCSeconds();
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
}
