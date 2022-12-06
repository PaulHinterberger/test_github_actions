import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';

@Component({
  selector: 'app-schnapp-nonverbale-intelligenz-between',
  templateUrl: './schnapp-nonverbale-intelligenz-between.page.html',
  styleUrls: ['./schnapp-nonverbale-intelligenz-between.page.scss'],
})
export class SchnappNonverbaleIntelligenzBetweenPage implements OnInit {
  nextPagePressed = false;

  constructor(private router: Router,
              public data: DataService,
              ) { }

  ngOnInit() {
  }
  nextPage() {
      if (this.nextPagePressed === false) {
          this.nextPagePressed = true;
          this.router.navigate(['schnapp-nonverbale-intelligenz-b']);
      }
}

}
