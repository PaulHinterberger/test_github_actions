import { Component, OnInit } from '@angular/core';
import {NavController} from "@ionic/angular";
import {ActivatedRoute, Router} from "@angular/router";
import {SmartAudioService} from "../../../services/smart-audio.service";
import {DataService} from "../../../services/data.service";

@Component({
  selector: 'app-lv-bereit',
  templateUrl: './lv-bereit.page.html',
  styleUrls: ['./lv-bereit.page.scss'],
})
export class LvBereitPage implements OnInit {

  isCardActive = false;
  isPlayed = false;
  selectedIndex = -2;
  clickcounter = 0;
  text = 'Bist du bereit?';


  constructor(public navCtrl: NavController, private router: Router, private smartAudio: SmartAudioService, public data: DataService,
              public route: ActivatedRoute) {
    route.params.subscribe(val => {
      this.isCardActive = false;
      this.selectedIndex = -2;
    });
  }

  ngOnInit() {
    this.smartAudio.preload("einverstaendnis","assets/audio/kindereinverstaendnis.mp3")
    this.playAudio();
  }

  nextPage() {
      if(this.data.current_testset.exercises[0].route.includes('adult')){
        this.router.navigate([this.data.current_testset.exercises[1].route]);
      }
      else{
        this.router.navigate([this.data.current_testset.exercises[0].route]);
      }
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }

  playAudio() {
      this.smartAudio.play('einverstaendnis');
  }

  getPlayIcon(): string {
      return 'play';
  }


}
