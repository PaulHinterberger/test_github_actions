import {Exercise} from '../exercise';

export class LvSchreibenExercise extends Exercise {
    public pngs: String[] = [];
    public words: string[] = [];
    public corrects: boolean[] = [];
    public dict: { [id: string]: boolean } = {};
    public sumCorrect = 0;
    public configFile = "";
    constructor(public title = '') {
        super(title);
    }
}
