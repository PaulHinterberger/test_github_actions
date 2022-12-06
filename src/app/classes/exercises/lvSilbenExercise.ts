import {Exercise} from '../exercise';

export class LvSilbenExercise extends Exercise {
    public correct = false;
    constructor(public title = '') {
        super(title);
    }
}
