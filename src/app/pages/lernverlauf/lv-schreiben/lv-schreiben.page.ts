import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {DataService} from '../../../services/data.service';
import {SmartAudioService} from '../../../services/smart-audio.service';
import {fromEvent} from 'rxjs';
import {switchMap, takeUntil, pairwise} from 'rxjs/operators';
import {LvSchreibenExercise} from '../../../classes/exercises/lvSchreibenExercise';
import {HttpClient} from '@angular/common/http';
import { DebugModeComponent } from '../../../common-components/debug-mode/debug-mode.component';

@Component({
    selector: 'app-lv-schreiben',
    templateUrl: './lv-schreiben.page.html',
    styleUrls: ['./lv-schreiben.page.scss'],
})
export class LvSchreibenPage implements OnInit {

    constructor(
        private router: Router,
        public data: DataService,
        public smartAudio: SmartAudioService,
        public sourceLoader: HttpClient) {
    }
    isPlayed = false;
    tutorialCount = 0;
    wordCount = -1;
    exercise = new LvSchreibenExercise();
    mp3Files: string[] = [];
    correctWords: string[] = [];
    debugMode = new DebugModeComponent();

    @ViewChild('canvas') canvasEl: ElementRef;
    private drawingCanvas: HTMLCanvasElement;
    private context2d: any;
    private lastPos = {x: -1, y: -1};
    private drawingAvailable = false;

    ngOnInit() {
        this.exercise.route = 'lv-schreiben';    
        this.data.setExerciseProperties(this.exercise);
        this.isPlayed=false;
        this.drawingCanvas = this.canvasEl.nativeElement;
        this.drawingCanvas.width = 800;
        this.drawingCanvas.height = 300;
        this.setupCanvas();
        this.captureEvents(this.drawingCanvas);

        this.smartAudio.replaceSound('schreiben-instruktion', 'assets/lernverlauf/audios/L1_Wortschreiben/File_161_Wortschreiben_Instruktion.mp3');
        this.smartAudio.replaceSound('88-item-instruktion', 'assets/lernverlauf/audios/L1_Wortschatzvalidierung/Wortschatzvalidierung_Instruktion.mp3');
        this.smartAudio.replaceSound('schreiben-instruktion2', 'assets/lernverlauf/audios/L1_Wortschreiben/Schnapp_Schreiben1_Instruktion.mp3');

        if(this.data.current_testset === undefined || this.data.current_testset === null){
            this.exercise.configFile = "assets/lernverlauf/03-schreiben/default_item-config.csv"
        }
        else{
            console.log(this.data.current_testset);
            this.exercise.configFile = this.data.getExerciseByRoute('lv-schreiben').configFile;
        }
        this.sourceLoader.get(this.exercise.configFile, {responseType: 'text'})
            .subscribe(async data => {
                const exerciseConfig = data.split('\n').splice(1);
                this.correctWords = exerciseConfig
                    .map(item => item.split(';')[0]);
                this.mp3Files = exerciseConfig
                    .map(item => item.split(';')[1]);
                let i = 1;
                this.mp3Files.forEach(element => {
                    this.smartAudio.preload('schreiben-item-' + (i++), element, true);
                });
            });
    }

    isTutorial() {
        return this.wordCount <= 0;
    }

    skipExercise() {
        this.nextPage();
    }

    getHeadline(){
        if (this.wordCount === -1){
            if(!this.isPlayed){
                if(this.exercise.configFile.includes("88-item-config.csv")||this.exercise.configFile.includes("88_item-config.csv")){
                    this.smartAudio.play("88-item-instruktion");
                    this.isPlayed=true;
                }    
                if(this.exercise.configFile.includes("1_Klasse.csv")||this.exercise.configFile.includes("2_Klasse.csv")){
                    this.smartAudio.play("schreiben-instruktion2");
                    this.isPlayed=true;
                } 
            }
            return 'Schreibe Deinen Namen!';
        }
        return this.exercise.title;
    }

    getSubTitle(){
        switch(this.wordCount){
            case -1: return ''; break;
            case 0: return 'Übung'; break;
            default: return `Durchgang ${this.wordCount} von ${this.mp3Files.length}`; break;
        }
    }

    nextWord() {
        if (this.wordCount === -1){
            this.wordCount++;
            this.smartAudio.play('schreiben-instruktion');
            this.setupCanvas();
            return;
        }
        
        if (this.wordCount !== 0) {
            this.exercise.pngs.push(this.drawingCanvas.toDataURL());
            this.exercise.words.push(this.correctWords.shift());
        }

        // 41
        if (this.wordCount  === this.mp3Files.length) {
            this.nextPage();
        } else{
            this.wordCount++;
            this.playAudio();
            this.setupCanvas();
        }       
    }

    playAudio() {
        // console.log('playaudio');
            switch (this.wordCount) {
                case 0: {
                    this.smartAudio.play('schreiben-instruktion');
                    break;
                }
                default: {
                    this.smartAudio.play('schreiben-item-' + this.wordCount);
                    break;
                }
            }
    }

    getPlayIcon(): string {
        return this.data.isAudioPlaying ? 'pause' : 'play';
    }

    nextPage() {
        this.exercise.finished = true;
        if (this.data.result !== undefined) {
            this.data.result.schreibenEvaluated = false;
            this.data.result.results.push(this.exercise);
            this.data.saveResult(false);
        }
        this.router.navigate([this.data.getNextExerciseRoute(this.exercise.route)]);
    }

    setupCanvas(): void {
        this.context2d = this.drawingCanvas.getContext('2d');
        this.context2d.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        this.context2d.fillStyle = '#3e3e3e';
        this.context2d.fillRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
        this.context2d.beginPath();
        this.context2d.moveTo(5, this.drawingCanvas.height / 3 * 2);
        this.context2d.lineTo(this.drawingCanvas.width - 5, this.drawingCanvas.height / 3 * 2);
        this.context2d.lineWidth = 1;
        this.context2d.strokeStyle = '#aaaaaa';
        this.context2d.stroke();
        this.lastPos.x = -1;
        this.lastPos.y = -1;
        this.drawingAvailable = false;
    }

    drawOnCanvas(
        prevPos: { x: number, y: number },
        currentPos: { x: number, y: number }): void {

        this.context2d.beginPath();
        this.context2d.lineJoin = 'round';
        this.context2d.moveTo(prevPos.x, prevPos.y);
        this.context2d.lineTo(currentPos.x, currentPos.y);
        this.context2d.closePath();
        this.context2d.lineWidth = 3;
        this.context2d.strokeStyle = '#ffffff';
        this.context2d.stroke();
        
        this.drawingAvailable = true;
    }

    captureEvents(canvasEl: HTMLCanvasElement) {

        fromEvent(canvasEl, 'touchstart')
            .subscribe((e: TouchEvent) => {
                const rect = canvasEl.getBoundingClientRect();
                this.lastPos.x = e.changedTouches[0].pageX - rect.left,
                    this.lastPos.y = e.changedTouches[0].pageY - rect.top;
                const startPointPos = {
                    x: this.lastPos.x,
                    y: this.lastPos.y - 1
                };
                this.drawOnCanvas(this.lastPos, startPointPos);
            });
        fromEvent(canvasEl, 'touchmove')
            .subscribe((e: TouchEvent) => {
                e.preventDefault();
                const rect = canvasEl.getBoundingClientRect();
                const currentPos = {
                    x: e.changedTouches[0].pageX - rect.left,
                    y: e.changedTouches[0].pageY - rect.top
                };
                if (this.lastPos.x === -1) {
                    this.lastPos = currentPos;
                } else {
                    this.drawOnCanvas(this.lastPos, currentPos);
                    this.lastPos = currentPos;
                }
            });

        // this will capture all mousedown events from the canvas element
        fromEvent(canvasEl, 'mousedown')
            .pipe(
                switchMap((e) => {
                    // after a mouse down, we'll record all mouse moves
                    return fromEvent(canvasEl, 'mousemove')
                        .pipe(
                            // we'll stop (and unsubscribe) once the user releases the mouse
                            // this will trigger a 'mouseup' event
                            takeUntil(fromEvent(canvasEl, 'mouseup')),
                            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
                            takeUntil(fromEvent(canvasEl, 'mouseleave')),
                            // pairwise lets us get the previous value to draw a line from
                            // the previous point to the current point
                            pairwise()
                        );
                })
            )
            .subscribe((res: [MouseEvent, MouseEvent]) => {
                const rect = canvasEl.getBoundingClientRect();

                // previous and current position with the offset
                const prevPos = {
                    x: res[0].clientX - rect.left,
                    y: res[0].clientY - rect.top
                };

                const currentPos = {
                    x: res[1].clientX - rect.left,
                    y: res[1].clientY - rect.top
                };

                // this method we'll implement soon to do the actual drawing
                this.drawOnCanvas(prevPos, currentPos);
            });
    }

}
