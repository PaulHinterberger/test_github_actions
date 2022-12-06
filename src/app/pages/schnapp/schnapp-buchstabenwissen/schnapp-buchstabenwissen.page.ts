import {StopWatchService} from 'src/app/services/stop-watch.service';
import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {SchnappBuchstabenwissenExercise} from 'src/app/classes/exercises/schnappBuchstabenwissenExercise';
import {DataService} from 'src/app/services/data.service';
import {HttpClient} from '@angular/common/http';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {DebugModeComponent} from '../../../common-components/debug-mode/debug-mode.component';

@Component({
  selector: 'app-schnapp-buchstabenwissen',
  templateUrl: './schnapp-buchstabenwissen.page.html',
  styleUrls: ['./schnapp-buchstabenwissen.page.scss'],
})
export class SchnappBuchstabenwissenPage implements OnInit {
  nextPagePressed = false;
  exercise = new SchnappBuchstabenwissenExercise();
  lettersForEvaluation : string[] = [];
  letters: {first: string, second: string, third: string, fourth: string}[] = [
    {first: 'N', second: 'L', third: 'M', fourth: 'O'}, 
    {first: 'D', second: 'B', third: 'C', fourth: 'A'}, 
    {first: 'R', second: 'Q', third: 'S', fourth: 'P'}, 
    {first: 'G', second: 'F', third: 'H', fourth: 'E'},
    {first: 'U', second: 'T', third: 'V', fourth: 'W'}, 
    {first: 'K', second: 'J', third: 'I', fourth: ''}, 
    {first: 'Y', second: 'Z', third: 'X', fourth: ''}];
  corOrIncor: {first: boolean, second: boolean, third: boolean, fourth: boolean}[] = [
    {first: false, second: false, third: false, fourth: false}, 
    {first: false, second: false, third: false, fourth: false}, 
    {first: false, second: false, third: false, fourth: false}, 
    {first: false, second: false, third: false, fourth: false},
    {first: false, second: false, third: false, fourth: false}, 
    {first: false, second: false, third: false, fourth: false}, 
    {first: false, second: false, third: false, fourth: false}];
  currentItem = 0;
  checked: boolean[] = [];
  checkeda = true;
  btnColors: string[] = ['success', 'success', 'success', 'success'];
  isCardActive = false;
  private debugMode = new DebugModeComponent();

  constructor(public navCtrl: NavController, public smartAudio: SmartAudioService, private router: Router, public data: DataService, private sourceLoader: HttpClient, public route: ActivatedRoute, public stopWatch: StopWatchService) {
    route.params.subscribe(val => {
      this.nextPagePressed = false;
    });
    stopWatch.start();
  }

  ngOnInit() {
    this.exercise.route = 'schnapp-buchstabenwissen';
    this.data.setExerciseProperties(this.exercise);
    this.smartAudio.sounds = [];
    this.smartAudio.preload('instruction41', 'assets/schnapp/schnapp-buchstabenwissen/audioFiles/Ex4File43BuchstabenInstruktionMASTER.mp3');
    this.smartAudio.play('instruction41');
    this.exercise.sumCorrect = 26;
    this.exercise.sumFalse = 0;
    /* for (let i = 0; i < 26; i++) {
      this.checked[i] = false;
    } */
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }
  checkLetter(item: number){
    if(item === 1){
      this.corOrIncor[this.currentItem].first = true;
      this.btnColors[0] = 'secondary';
    }
    if(item === 2){
      this.corOrIncor[this.currentItem].second = true;
      this.btnColors[1] = 'secondary';
    }
    if(item === 3){
      this.corOrIncor[this.currentItem].third = true;
      this.btnColors[2] = 'secondary';
    }
    if(item === 4){
      if(this.currentItem !== 5 && this.currentItem !== 6){
        this.corOrIncor[this.currentItem].fourth = true;
        this.btnColors[3] = 'secondary';
      }
    }
    console.log(this.corOrIncor[this.currentItem]);
  }

  checkoutLetter(){
      this.corOrIncor[this.currentItem].first = false;
      this.corOrIncor[this.currentItem].second = false;
      this.corOrIncor[this.currentItem].third = false;
      if(this.currentItem !== 5 && this.currentItem !== 6){
        this.corOrIncor[this.currentItem].fourth = false;
      }
      this.initColor();
  }

  initColor(){
    this.btnColors[0] = 'success';
    this.btnColors[1] = 'success';
    this.btnColors[2] = 'success';
    this.btnColors[3] = 'success';
  }

  nextPage() {
    this.getEvaluation();
    this.initColor();
    if (this.currentItem + 1 === this.letters.length){
      this.finished();
    }
    this.currentItem++;
  }

  lastPage() {
    for (var i = 0; i < 4; i++){
      this.lettersForEvaluation.pop();
      this.checked.pop();
    }
    this.currentItem--;
    this.checkoutLetter();
  }

  deleteInput(){
    this.corOrIncor[this.currentItem].first = false;
    this.corOrIncor[this.currentItem].second = false;
    this.corOrIncor[this.currentItem].third = false;
    this.corOrIncor[this.currentItem].fourth = false;
    this.initColor();
    console.log(this.corOrIncor[this.currentItem]);
  }

  skipExercise() {
    this.finished();
  }

  getEvaluation(){
    this.lettersForEvaluation.push(this.letters[this.currentItem].first);
    this.checked.push(this.corOrIncor[this.currentItem].first);
    this.lettersForEvaluation.push(this.letters[this.currentItem].second);
    this.checked.push(this.corOrIncor[this.currentItem].second);
    this.lettersForEvaluation.push(this.letters[this.currentItem].third);
    this.checked.push(this.corOrIncor[this.currentItem].third);
    if(this.currentItem !== 5 && this.currentItem !== 6){
      this.lettersForEvaluation.push(this.letters[this.currentItem].fourth);
      this.checked.push(this.corOrIncor[this.currentItem].fourth);
    }
  }

  finished(){
    for (let i = 0; i < 26; i++) {
      this.exercise.dict[this.lettersForEvaluation[i]] = this.checked[i];
    }
    this.exercise.sumCorrect = this.getSelected();
    this.exercise.sumFalse = this.getNotSelected();
    this.stopWatch.stop();
    this.stopWatch.reset();
    this.exercise.finished = true;
    this.data.result.results.push(this.exercise);
    this.data.saveResult(false);
    this.router.navigate(['exercise-finished'], {fragment: this.data.getNextExerciseRoute(this.exercise.route)});
  }

  resetAudio() {
    this.smartAudio.play('instruction41');
  }

  getNotSelected(): number {
    let cnt = 0;
    for (const e of this.checked) {
      if (e === false) {
        cnt++;
      }
    }
    return cnt;
  }

  getSelected(): number {
    let cnt = 0;
    for (const e of this.checked) {
      if (e === true) {
        cnt++;
      }
    }
    return cnt;
  }

  onBoxClick(index: number) {
    if (this.checked[index] === false) {
      this.checked[index] = true;
    } else {
      this.checked[index] = false;
    }
  }
}
