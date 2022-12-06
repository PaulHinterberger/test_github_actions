import {StopWatchService} from 'src/app/services/stop-watch.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {SchnappSilbenExercise} from 'src/app/classes/exercises/schnappSilbenExercise';
import {DataService} from 'src/app/services/data.service';
import {NativeAudio} from '@ionic-native/native-audio/ngx';
import {Student} from 'src/app/classes/student';
import {Examiner} from 'src/app/classes/examiner';
import {AppConfig} from '../../../classes/config/AppConfig';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-silben',
  templateUrl: './schnapp-silben.page.html',
  styleUrls: ['./schnapp-silben.page.scss'],
})
export class SchnappSilbenPage implements OnInit {
  nextPagePressed = false;
  exercise = new SchnappSilbenExercise();
  currentlySelected = 0;
  currentWord = '';
  currentRightAmountOfSyllables = 0;
  wordsWithSyllables: String[];
  words: String[] = [];
  example = 0;
  back = true;
  playedInstruction = false;
  isCardActive = false;
  test = false;
  checkBoxStyles = ['', '', '', ''];
  lastSelected = -1;
  currentItem = 0;
  private debugMode = new DebugModeComponent();

// tslint:disable-next-line: max-line-length
  constructor(public navCtrl: NavController, private router: Router, public data: DataService, private sourceLoader: HttpClient, private nativeAudio: NativeAudio, private smartAudio: SmartAudioService, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.nextPagePressed = false;
    });
    this.stopWatch.start();
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-silben';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.sounds = [];
    this.smartAudio.preload('instruction5_1', 'assets/schnapp/schnapp-silben/audioFiles/File70SilbenInstruktion1.mp3');
    this.smartAudio.play('instruction5_1');
    this.sourceLoader.get('assets/schnapp/schnapp-silben/stringResources/res_text.csv', {responseType: 'text'})
      .subscribe(data => {
        this.wordsWithSyllables = data.split('\n').splice(1);
        if (this.wordsWithSyllables.length > 0) {
          this.nextWord();
        } else {
          alert('No data found. Redirecting to evaluation page. Test will be resumed');
          this.finished();
        }
      });
  }

  nextPageAllowed(){
    if (this.isExercise()){
      return this.checkBoxStyles.join('').includes('borderCorrected');
    }
    return this.checkBoxStyles.join('').includes('borderSelected');
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  getIcon() {
    return this.data.isAudioPlaying && this.playedInstruction ? 'pause' : 'play';
  }

  resetAudio() {
    this.smartAudio.play('instruction5_1');
    this.initCheckBoxStyles();
  }

  getSubtitle() {
    if (this.isExercise()) {
      return 'Übung ' + (this.currentItem + 1) + ' von 3';
    } else {
      return 'Durchgang ' + (this.currentItem - 2) + ' von 10';
    }
  }

  nextPage() {
    this.initCheckBoxStyles();
    this.test = true;
    if (this.data.isAudioPlaying) {
      this.smartAudio.stop('audio' + (this.currentItem + 1));
    }
    this.back = false;
    if ((this.currentItem +1) < this.wordsWithSyllables.length) {
      if (!this.isExercise()) {
        this.exercise.dict[this.currentWord] = this.currentlySelected === this.currentRightAmountOfSyllables;
      }
        this.lastSelected = this.currentlySelected;
      this.currentItem++;
        this.nextWord();
        this.playAudio();
        this.currentlySelected = 0;
    } else {
      this.exercise.dict[this.currentWord] = this.currentlySelected === this.currentRightAmountOfSyllables;
      if (this.nextPagePressed === false) {
        this.nextPagePressed = true;
        this.exercise.sumCorrect = 0;
        // tslint:disable-next-line: forin
        for (const key in this.exercise.dict) {
          if (this.exercise.dict[key] === true) {
            this.exercise.sumCorrect++;
          }
          this.words.push(key);
        }

        this.finished();
      }
    }
  }

  skipExercise() {
    this.finished();
  }

  finished(){
    this.stopWatch.stop();
    this.stopWatch.reset();
    this.exercise.finished = true;
    this.data.result.results.push(this.exercise);
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  lastPage() {
    this.currentItem -= 1;
    this.nextWord();
    this.checkBoxStyles[this.lastSelected - 1] = 'borderSelected';
    this.back = true;
  }

  playAudio() {
    if (this.data.isAudioPlaying && !this.playedInstruction) {
      this.playedInstruction = true;
      this.smartAudio.play('audio' + (this.currentItem + 1));
    } else if (this.data.isAudioPlaying) {
      this.smartAudio.stop('audio' + (this.currentItem + 1));
    } else {
      this.playedInstruction = true;
      this.smartAudio.play('audio' + (this.currentItem + 1));
    }
    this.initCheckBoxStyles();
  }

  isExercise() {
    return this.currentItem < 3;
  }

  initCheckBoxStyles() {
    this.checkBoxStyles = ['', '', '', ''];
  }


  enterResult(syllables: number) {
    this.currentlySelected = syllables;
    this.initCheckBoxStyles();
    this.checkBoxStyles[this.currentlySelected - 1] = 'borderSelected';
    if (this.isExercise()) {
      setTimeout(() => {
        this.checkBoxStyles[this.currentRightAmountOfSyllables - 1] = 'borderCorrected';
        if (this.currentItem === 1) {
          // tslint:disable-next-line: max-line-length
          this.smartAudio.preload('instruction5_2', 'assets/schnapp/schnapp-silben/audioFiles/Ex5_File_48_Silben_Instruktion_4MASTER.mp3');
          this.smartAudio.play('instruction5_2');
        } else if (this.currentItem === 2) {
          // tslint:disable-next-line: max-line-length
          this.smartAudio.preload('instruction5_3', 'assets/schnapp/schnapp-silben/audioFiles/Ex5_File_50_Silben_Instruktion_6MASTER.mp3');
          this.smartAudio.play('instruction5_3');
      }
        }, AppConfig.TimeoutTutorialFeedback);
    }
  }

  splitString(stringToSplit: String) {
    return stringToSplit.split(';');
  }

  nextWord() {
    this.initCheckBoxStyles();
    const splittedString = this.splitString(this.wordsWithSyllables[this.currentItem]);
    this.currentWord = splittedString[0];
    this.currentRightAmountOfSyllables = parseInt(splittedString[1], 10);
    this.smartAudio.preload('audio' + (this.currentItem +1), 'assets/schnapp/schnapp-silben/audioFiles/audio' + (this.currentItem +1) + '.mp3');
  }

  getImg(): string {
    return 'assets/schnapp/images/' + this.currentWord;
  }
}
