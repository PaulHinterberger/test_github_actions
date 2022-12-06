import {Student} from './student';
import {Examiner} from './examiner';
import {Exercise} from './exercise';


export class Result {
    public id = '';
    public characterImageName = '';
    public schreibenEvaluated: Boolean = null;
    public finished = false;
    public endDate: Date = null;
    public sendedResult: Boolean=false;

    constructor(
        public student: Student = null,
        public examiner: Examiner = null,
        public testingDate: Date = null,
        public version: string = "",
        public results: Exercise[] = [],
        public testTemplateId = ''
    ) {
    }
}
