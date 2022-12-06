import { Component, ElementRef, OnInit, Renderer, ViewChild, Renderer2 } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {delay} from 'rxjs/operators';
import {timer} from 'rxjs';
import { Exercise } from 'src/app/classes/exercise';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild('img', {read: ElementRef}) character;
  clickCounter = 0;
  counter = 0;
  currentAudio = '';
  state = 'NOTHING';
  startArea: Array<string> = [];
  middleArea: Array<string> = [];
  thirdArea: Array<string> = [];
  finalArea: Array<string> = [];
  finalArea2: Array<string> = [];
  mapCssClass: String = '';
  drag: String = '';
  isAudioPlayed: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public data: DataService,
    public renderer: Renderer2,
    public smartAudio: SmartAudioService
  ) {
  }

  ngOnInit() {
    this.smartAudio.sounds = [];
    this.smartAudio.preload('story1', 'assets/audio/schnapp7/File_1_NEU_Einleitung_Geschichte.mp3');
    this.route.params.subscribe(params => {
      this.state = params['state'];
    });
    this.startArea.push(this.getImg());
    if (this.state === 'lichtung-wegweiser' || this.state === 'lichtung-ziehen' || this.state === 'lichtung-kobolde') {
      this.mapCssClass = 'mapForest';
      if (this.state === 'lichtung-kobolde') {
        this.middleArea.push(this.getImg());
      }
    } else if (this.state === 'labyrinth-start' || this.state === '11a' || this.state === 'labyrinth-durchziehen') {
      this.mapCssClass = 'mapLabyrinth';
    } else {
      this.mapCssClass = 'mapMountain';
      if (this.state === 'berge-steine') {
        this.middleArea.push(this.getImg());
      } else if (this.state === 'berge-berggeist') {
        this.thirdArea.push(this.getImg());
      } else if (this.state === 'berge-schatz') {
        this.finalArea.push(this.getImg());
      }
    }
    if (this.state === 'lichtung-wegweiser' && this.startArea.length === 1) {
      this.smartAudio.play('story1');
      this.currentAudio = 'story1';
    } else if (this.state === 'lichtung-ziehen') {
      this.smartAudio.preload('story3', 'assets/audio/' + 'schnapp7/File_20_NEU_GeschichteMap1.mp3');
      this.smartAudio.play('story3');
      this.currentAudio = 'story3';
    } else if (this.state === 'lichtung-ziehen' && this.middleArea.length === 1) {
      //this.smartAudio.sounds = [];
        this.smartAudio.preload('story4', 'assets/audio/' + 'schnapp7/File_21_NEU_Lichtung_Geschichte.mp3');
        this.smartAudio.play('story4');
        this.currentAudio = 'story4';
    } else if (this.state === 'lichtung-kobolde' && this.middleArea.length === 1) {
      //this.smartAudio.sounds = [];
        this.smartAudio.preload('story2', 'assets/audio/' + 'schnapp7/File_42.1_NEU_Instruktion.mp3');
        this.smartAudio.play('story2');
        this.currentAudio = 'story2';
    } else if (this.state === 'labyrinth-start' && this.startArea.length === 1) {
      this.smartAudio.preload('story5', 'assets/audio/' + 'File43EingangLabyrinthGeschichte.mp3');
      this.smartAudio.play('story5');
      this.currentAudio = 'story5';
    } else if (this.state === 'labyrinth-durchziehen') {
      this.smartAudio.preload('story6', 'assets/audio/' + 'File48EndeLabyrinthGeschichte.mp3');
      this.smartAudio.play('story6');
      this.currentAudio = 'story6';
      this.clickCounter++;
    } else if (this.state === 'berge-start' && this.startArea.length === 1) {
      this.smartAudio.preload('story7', 'assets/audio/File49StartBergweltGeschichte.mp3');
      this.smartAudio.play('story7');
      this.currentAudio = 'story7';
      this.clickCounter++;
    } else if (this.state === 'berge-stampfen' && this.startArea.length === 1) {
      this.smartAudio.preload('story8', 'assets/audio/File69bergauf.mp3');
      this.smartAudio.play('story8');
      this.currentAudio = 'story8';
    } else if (this.state === 'berge-bruecke') {
      this.smartAudio.preload('story9', 'assets/audio/schnapp7/File_86_NEU_Bruecke.mp3');
      this.smartAudio.play('story9');
      this.currentAudio = 'story9';
    } else if (this.state === 'berge-steine' && this.thirdArea.length === 0) {
      this.smartAudio.preload('story11', 'assets/audio/File99Bruecke.mp3');
      this.smartAudio.play('story11');
      this.currentAudio = 'story11';
    } else if (this.state === 'berge-berggeist') {
      this.smartAudio.preload('story13', 'assets/audio/schnapp7/File_99_NEU_Bruecke.mp3');
      this.smartAudio.play('story13');
      this.currentAudio = 'story13';
    }  else if (this.state === 'berge-schatz') {
      this.smartAudio.preload('story15', 'assets/audio/schnapp7/File_136_NEU_Schatzkiste_Geschichte.mp3');
      this.smartAudio.play('story15');
      this.currentAudio = 'story15';
    } else if (this.state === 'geschafft') {
      this.smartAudio.preload('story16', 'assets/audio/schnapp7/File_172_NEU_Ende_Geschichte.mp3');
      this.smartAudio.play('story16');
      this.currentAudio = 'story16';
    }
  }

  isNextButtonDisabled(): boolean {
    if (this.state === 'lichtung-wegweiser') {
      console.log(this.isAudioPlayed);
      if (this.startArea.length === 1 && this.data.isAudioFinished) {
        return false;
      }
    } else if (this.state === 'lichtung-ziehen') {
      if (this.middleArea.length === 1 && this.data.isAudioFinished) {
        return false;
      }
    } else if (this.state === 'lichtung-kobolde') {
      if (this.finalArea.length === 1) {
        return false;
      }
    } else if (this.state === 'labyrinth-start') {
       if (this.startArea.length === 1) {
        return false;
      }
    } else if (this.state === '11a') {
      if (this.middleArea.length === 1) {
        return false;
      }
    } else if (this.state === 'labyrinth-durchziehen') {
      if (this.finalArea.length === 1) {
        return false;
      }
    } else if (this.state === 'berge-start') {
      if (this.startArea.length === 1 && this.data.isAudioFinished) {
        return false;
      }
    } else if (this.state === 'berge-stampfen') {
      if (this.startArea.length === 1) {
        return false;
      }
    } else if (this.state === 'berge-bruecke') {
      if (this.data.isAudioFinished) {
        return false;
      }
    } else if (this.state === 'berge-steine') {
      if (this.thirdArea.length === 1) {
        return false;
      }
    } else if (this.state === 'berge-berggeist') {
      if (this.finalArea.length === 1 && this.data.isAudioFinished) {
        return false;
      }
    } else if (this.state === 'berge-schatz') {
      if (this.data.isAudioFinished) {
        return false;
      }
    } else if (this.state === 'geschafft') {
      if(this.data.isAudioFinished){
        return false;
      }
    }
    return true;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
        if (this.state === 'lichtung-ziehen' && this.middleArea.length === 1){
          // Kobolde tauchen auf
          this.currentAudio = 'story4';   
          this.smartAudio.preload('story4', 'assets/audio/' + 'schnapp7/File_21_NEU_Lichtung_Geschichte.mp3');
          this.smartAudio.play('story4');
        }    
        else if (this.state === 'berge-steine' && this.thirdArea.length === 1) {
            /* this.smartAudio.preload('story12', 'assets/audio/File100Steinbrocken.mp3');
            this.smartAudio.play('story12');
            this.currentAudio = 'story12';   */ 
            this.goToNextPage();
        }    
        else if (this.state === 'berge-bruecke' && this.middleArea.length === 1 ) {
            this.smartAudio.preload('story10', 'assets/audio/schnapp7/File_86_NEU_Bruecke.mp3');
            this.smartAudio.play('story10');
            this.currentAudio = 'story10';
        }
        else if (this.state === 'berge-berggeist' && this.finalArea.length === 1) {
            this.smartAudio.preload('story14', 'assets/audio/schnapp7/File_119_NEU_Berggeist.mp3');
            this.smartAudio.play('story14');
            this.currentAudio = 'story14';
        } 
    }
  }


  setPosition() {
  }

  getImg(): string {
    // return 'assets/animations/' + this.data.result.characterImageName + '.png';
    // return 'assets/animations/Drache.gif';
    if (this.state === 'lichtung-wegweiser') {
      this.drag = 'cdk-drag-preview';
      return 'assets/animations/winken.gif';
    } else if (this.state === 'lichtung-wegweiser' && this.clickCounter === 1) {
      this.drag = 'cdk-drag-preview';
      return 'assets/animations/dracheKopf.gif';
    } else if (this.state === 'lichtung-ziehen' || this.state === 'lichtung-kobolde' || this.state === 'berge-start' ||
      this.state === 'berge-bruecke' || this.state === 'berge-steine' || this.state === 'berge-berggeist' || this.state === 'berge-schatz') {
      this.drag = 'cdk-drag-preview';
      return 'assets/animations/Drache.gif';
    } /**else if (this.state === 'berge-stampfen') {
      this.drag = 'cdk-drag-preview';
      return 'assets/animations/stampfen_langsamer.gif';
    } **/ else if ( this.state === '11a' || this.state === 'labyrinth-durchziehen') {
      this.drag = 'cdk-drag-preview';
      return 'assets/animations/drache_luchs_gespiegelt.gif';
    }
  }

  resetAudio() {
    this.clickCounter = 0;
  }

  goToNextPage() {

    this.isAudioPlayed = false;
    const exercise = new Exercise('map', 'map/' + this.state);
    const nextPage = this.data.getNextExerciseRoute(exercise.route);
    console.log('nextPage: ' + nextPage);

    if (this.currentAudio){
      this.smartAudio.stop(this.currentAudio);
    }
    this.router.navigate([nextPage]);
 
  }

  viewButton(){
    this.isAudioPlayed = true;
  }

}
