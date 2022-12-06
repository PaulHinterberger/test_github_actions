import {Exercise} from '../exercise';

export class LvSchreibenCSVExercise extends Exercise {
    public dict: { [id: string]: boolean } = {};
    public title = '';
    constructor() {
        super();
    }
}