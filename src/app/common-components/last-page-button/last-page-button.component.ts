import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-last-page-button',
  templateUrl: './last-page-button.component.html',
  styleUrls: ['./last-page-button.component.scss'],
})
export class LastPageButtonComponent implements OnInit {

  @Output() Clicked: EventEmitter<any> = new EventEmitter();
  @Input() Enabled = true;
  @Input() Visible = true;
  
  delayedEnabled = false;
  delayTimeout: any;

  handleClick(){
    this.Clicked.emit();
    this.delayEnabled();
  }

  delayEnabled(){
    this.delayedEnabled = false;
    this.delayTimeout = setTimeout(() => {
      this.delayedEnabled = true;
    }, 1000);
  }

  ngOnInit() {
    this.delayEnabled();
  }



}
