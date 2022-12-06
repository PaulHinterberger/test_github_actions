import { Component, OnInit, DoCheck, AfterContentInit, OnChanges, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-next-page-button',
  templateUrl: './next-page-button.component.html',
  styleUrls: ['./next-page-button.component.scss'],
})
export class NextPageButtonComponent implements OnInit {

  @Output() Clicked: EventEmitter<any> = new EventEmitter();
  @Input() Enabled = true;
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
