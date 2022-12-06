import {Exercise} from '../exercise';

export class SchnappSilbenExercise extends Exercise {
    public dict: { [id: string]: boolean } = {};
    public sumCorrect = 0;

    constructor() {
        super();
    }
}
