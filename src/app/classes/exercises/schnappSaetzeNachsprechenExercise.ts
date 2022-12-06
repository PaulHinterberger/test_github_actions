import {Exercise} from '../exercise';

export class SchnappSaetzeNachsprechenExercise extends Exercise {
    public sumCorrect = 0;
    public dict: { [id: string]: boolean } = {};

    constructor() {
        super();
    }
}
