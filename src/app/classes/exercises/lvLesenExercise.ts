import {Exercise} from '../exercise';
import { Answer } from './Answer';
import { GraLeVAnswer } from './gralevAnswer';

export class LvLesenExercise extends Exercise {
    public sumCorrect = 0;
    public dict: { [id: string]: boolean } = {};
    public configFile = "";
    constructor(public title = '') {
        super(title);
    }
}
