import {Exercise} from '../exercise';
import { GraDigAnswer } from './gradigAnswer';

export class GraDigSubtestExercise extends Exercise {
    public sumCorrect = 0;
    public timeOverall='';
    public gradigAnswers=new Array<GraDigAnswer>();
    constructor(public title = '') {
        super(title);
    }
}