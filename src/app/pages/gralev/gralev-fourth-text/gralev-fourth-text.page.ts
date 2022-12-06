import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-gralev-fourth-text',
  templateUrl: './gralev-fourth-text.page.html',
  styleUrls: ['./gralev-fourth-text.page.scss'],
})
export class GralevFourthTextPage implements OnInit {

  exercise;
    isCardActive: Boolean = false;
    noteTemplates: Array<string>;

    constructor(public router: Router, private route: ActivatedRoute, public data: DataService) {
    }

    ngOnInit() {
        this.noteTemplates = ['Kind hat die Aufgabe nicht verstanden.;',
            'Musste auf Toilette.;',
            'Test wurde abgebrochen.;',
            'Schwankende Aufmerksamkeit.;'];
        if (this.data.result !== undefined) {
            console.log(this.data.result);
            console.log(this.data.result.results);

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
