
import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Exercise } from 'src/app/classes/exercise';


@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
})
export class NoteComponent implements OnInit {

  @Input() exercise;
  @Input() isCardActive: Boolean = false;
  @Input() evaluation: Boolean = false;
  @Input() data: DataService;
  noteTemplates: Array<string>;

  constructor() { }

  ngOnInit() {
    this.noteTemplates = ['Kind hat die Aufgabe nicht verstanden.;',
    'Musste auf Toilette.;',
    'Test wurde abgebrochen.;',
    'Schwankende Aufmerksamkeit.;']
  }

  setExercise(exercise: Exercise) {
    this.exercise = exercise;
  }

  changeCardActive() {
    this.isCardActive = !this.isCardActive;
  }
  addToTextArea(index: number) {
    this.exercise.note += this.noteTemplates[index];
}

}
