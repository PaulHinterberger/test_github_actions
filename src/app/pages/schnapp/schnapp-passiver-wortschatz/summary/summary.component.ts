import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SchnappPassiverWortschatzExercise} from 'src/app/classes/exercises/schnappPassiverWortschatzExercise';
import {Result} from 'src/app/classes/result';
import { RestService } from 'src/app/services/rest.service';
import { Platform, AlertController } from '@ionic/angular';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-grawo-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})

export class SummaryComponent implements OnInit {
  summaryTableColumns = ['number', 'word', 'correct']

  result: Result;
  result10: SchnappPassiverWortschatzExercise;
  title = 'GRAWO';


  constructor(
    private router: Router,
    public data: DataService,
    public rest: RestService,
    private platform: Platform,
    public alertController: AlertController
    ) {
  }

  ngOnInit() {
    this.result = this.data.result;
    if (this.result != null){
      this.result10 = this.result.results.find(x => x.number === 10) as SchnappPassiverWortschatzExercise;
    }
    if (this.data.current_testset != null){
      this.title = this.data.current_testset.title ;
    }
    console.log(this.result);
    console.log(this.result10);
  }

  
  nextPage() {
    this.router.navigate(['home']);
  }
}
