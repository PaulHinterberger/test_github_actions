import {Exercise} from '../exercise';

export class SchnappAnlauteErkennenExercise extends Exercise {
    public dict: { [id: number]: boolean } = {};
    public sumCorrect = 0;

    constructor() {
        super();
    }
}
