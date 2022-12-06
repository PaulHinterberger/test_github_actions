import {Exercise} from '../exercise';
import { GraLeVAnswer } from './gralevAnswer';

export class ExerciseGraLeVSentence extends Exercise {
    public sumCorrect = 0;
    public gralevAnswers = new Array<GraLeVAnswer>();
    constructor(public title = '') {
        super(title);
    }
}