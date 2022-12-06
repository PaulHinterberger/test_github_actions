import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StopWatchService {

  public timeBegan = null;
  public timeStopped: any = null;
  public blankTime = '00:00';
  public time = '00:00';
  public timeSeconds = 0;
  public stoppedDuration: any = 0;
  public started = null;
  public running = false;
  public waitingTimeNextPageButton = 1;

  constructor() { }

    start() {
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
  }

  stop() {
      this.running = false;
      this.timeStopped = new Date();
      clearInterval(this.started);
  }

  reset() {
      this.running = false;
      clearInterval(this.started);
      this.stoppedDuration = 0;
      this.timeBegan = null;
      this.timeStopped = null;
      this.time = this.blankTime;
      this.timeSeconds = 0;
  }

  clockRunning() {
      const currentTime: any = new Date();
      const timeElapsed: any = new Date(currentTime - this.timeBegan - this.stoppedDuration);
      const hour = timeElapsed.getUTCHours();
      const min = timeElapsed.getUTCMinutes();
      const sec = timeElapsed.getUTCSeconds();
      const ms = timeElapsed.getUTCMilliseconds();
      this.time =
          this.zeroPrefix(min, 2) + ':' +
          this.zeroPrefix(sec, 2);
      this.timeSeconds = min * 60 + sec;
  }

  zeroPrefix(num: string, digit: number) {
      let zero = '';
      for (let i = 0; i < digit; i++) {
          zero += '0';
      }
      return (zero + num).slice(-digit);
  }

  getTime(): string {
    return this.time;
  }
}
