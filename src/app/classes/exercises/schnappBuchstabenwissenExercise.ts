import {Exercise} from '../exercise';

export class SchnappBuchstabenwissenExercise extends Exercise {
    public dict: { [id: string]: boolean } = {};
    public sumFalse = 0;
    public sumCorrect = 0;

    constructor() {
        super();
    }
}
