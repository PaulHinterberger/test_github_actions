import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {SmartAudioService} from 'src/app/services/smart-audio.service';
import {fromEvent} from 'rxjs';
import {switchMap, takeUntil, pairwise} from 'rxjs/operators';
import {LvSchreibenExercise} from 'src/app/classes/exercises/lvSchreibenExercise';
import { R3ResolvedDependencyType } from '@angular/core/src/render3/jit/compiler_facade_interface';
import {HttpClient} from '@angular/common/http';
import { LvSchreibenCSVExercise } from 'src/app/classes/exercises/lvSchreibenCSVExercise';

@Component({
    selector: 'app-lv-schreiben',
    templateUrl: './lv-schreiben-evaluation.page.html',
    styleUrls: ['./lv-schreiben-evaluation.page.scss'],
})
export class LvSchreibenEvaluationPage implements OnInit {
    exercise = this.data.result.results.find(e => e.route === 'lv-schreiben') as LvSchreibenExercise;
    words = [];
    exer = new LvSchreibenCSVExercise();

    constructor(
        private router: Router,
        public data: DataService,
        public smartAudio: SmartAudioService,
        private route: ActivatedRoute,
        public sourceLoader: HttpClient) {
    }

    ngOnInit() {
        this.exer.title="Lösungen Schreiben";
        this.exer.route='';
        this.data.setExerciseProperties(this.exer);
        console.log(this.exercise.configFile);
        this.sourceLoader.get(this.exercise.configFile, {responseType: 'text'})
            .subscribe(async data => {
                const exerciseConfig = data.split('\n').splice(1);
                this.words = exerciseConfig
                    .map(item => item.split(';')[0]);
            });
    }

    nextPage() {
        this.exercise.sumCorrect = this.getRight();
        // this.fillDict();
        this.exer.finished= true;
        console.log(this.exer.dict);
        if (this.isFinished()) {
            this.data.result.schreibenEvaluated = true;
            this.data.result.finished = true;
        }
        if (this.data.result !== undefined){
            this.data.result.results.push(this.exer);
            this.data.saveResult(false);
        }
        this.router.navigate([this.route.snapshot.fragment]);
    }
    fillDict() {
        for(let i = 0; i < this.exercise.words.length; i++) {
            this.exer.dict[this.exercise.words[i]]=null;
        }
    }

    correct(b: boolean, i: number) {
        // console.log(i);
        this.exercise.corrects[i] = b;
        //console.log(this.exercise.words[i] + " ist " + b);
        this.exer.dict[this.exercise.words[i]]=b;
        //console.log(this.exer.dict[this.exercise.words[i]]);
        // console.log(this.exercise);
        // Alle bewertet?
    }

    isFinished(): boolean {
        for (let c = 0; c < this.exercise.pngs.length; c++) {
            if (this.exercise.corrects[c] === undefined) {
                return false;
            }
        }
        return true;
    }

    answer(a: boolean) {
        // console.log(a);
    }

    getRight() {
        let sum = 0;
        for (let c = 0; c < this.exercise.pngs.length; c++) {
            if (this.exercise.corrects[c] !== undefined && this.exercise.corrects[c] === true) {
                sum++;
            }
        }
        return sum;
    }
    getFalse() {
        let sum = 0;
        for (let c = 0; c < this.exercise.pngs.length; c++) {
            if (this.exercise.corrects[c] !== undefined && this.exercise.corrects[c] === false) {
                sum++;
            }
        }
        return sum;
    }

    getUncorrected() {
        let sum = 0;
        for (let c = 0; c < this.exercise.pngs.length; c++) {
            if (this.exercise.corrects[c] === undefined) {
                sum++;
            }
        }
        return sum;
    }
}
