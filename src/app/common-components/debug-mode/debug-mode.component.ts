import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-debug-mode',
  templateUrl: './debug-mode.component.html',
  styleUrls: ['./debug-mode.component.scss'],
})
export class DebugModeComponent implements OnInit {
  getVisible() {
    return environment.debugOn;
  }
  constructor() { }
  ngOnInit() {
    this.checkDebugMode();
  }

  checkDebugMode() {
   /* if (environment.production === false || environment.staging === false) {
    // console.log('I AM VISIBLE!');
      this.visible = true;
    }*/
  /*  else{
      console.log('That did not work as planned Production:', environment.production, 
      '\nStaging: ', environment.staging);
    }*/
    return environment.debugOn;
  }
}
