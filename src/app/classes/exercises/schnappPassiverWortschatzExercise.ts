import {Exercise} from '../exercise';
import {Answer} from './Answer';

export class SchnappPassiverWortschatzExercise extends Exercise {
    public sumCorrect = 0;
    public answers = new Array<Answer>();

    constructor() {
        super();
    }
}
