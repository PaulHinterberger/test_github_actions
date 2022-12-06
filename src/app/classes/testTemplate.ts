import {Exercise} from './exercise';

export class TestTemplate {
    constructor(public title = '', public id = '', public active = true, public exercises: Exercise[] = []) {
    }
}
