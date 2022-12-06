import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';
import {Exercise} from '../../classes/exercise';
import {SmartAudioService} from "../../services/smart-audio.service";

@Component({
    selector: 'app-exercise-finished',
    templateUrl: './exercise-finished.page.html',
    styleUrls: ['./exercise-finished.page.scss'],
})
export class ExerciseFinishedPage implements OnInit {
    exercise;
    isCardActive: Boolean = false;
    noteTemplates: Array<string>;

    constructor(public router: Router, private route: ActivatedRoute, public data: DataService, private smartAudio: SmartAudioService) {
        route.params.subscribe(val => {
            this.smartAudio.preload('super', 'assets/audio/SUPER_NEU.mp3');
            console.log("audio wurde geladen");
            this.smartAudio.play('super');
            console.log("audio wurde abgespielt");
            this.noteTemplates = ['Kind hat die Aufgabe nicht verstanden.;',
                'Musste auf Toilette.;',
                'Test wurde abgebrochen.;',
                'Schwankende Aufmerksamkeit.;'];
            if (this.data.result !== undefined) {
                console.log(this.data.result);
                // console.log(this.data.result.results);

                this.exercise = this.data.result.results[this.data.result.results.length - 1];
            }
        });
    }

    ngOnInit() {
        this.smartAudio.preload('super', 'assets/audio/SUPER_NEU.mp3');
        console.log("audio wurde geladen");
        this.smartAudio.play('super');
        console.log("audio wurde abgespielt");
        this.noteTemplates = ['Kind hat die Aufgabe nicht verstanden.;',
            'Musste auf Toilette.;',
            'Test wurde abgebrochen.;',
            'Schwankende Aufmerksamkeit.;'];
        if (this.data.result !== undefined) {
            console.log(this.data.result);
            // console.log(this.data.result.results);

            this.exercise = this.data.result.results[this.data.result.results.length - 1];
        }
    }

    changeCardActive() {
        this.isCardActive = !this.isCardActive;
    }

    addToTextArea(index: number) {
        this.exercise.note += this.noteTemplates[index];
    }

    nextPage() {
        if (this.data.result !== undefined) {
            this.data.saveResult(false);
        }
        this.router.navigate([this.route.snapshot.fragment]);
    }

    stopTest() {
        this.data.saveResult(true);
    }
}
