import {Exercise} from '../exercise';
import { Answer } from './Answer';
import { GraLeVAnswer } from './gralevAnswer';

export class ExerciseGraLeVWord extends Exercise {
    public sumCorrect = 0;
    public gralevAnswers = new Array<GraLeVAnswer>();
    constructor(public title = '') {
        super(title);
    }
}
