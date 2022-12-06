import {Exercise} from '../exercise';

export class FeedbackResultConfig{
    constructor(public question ='', public selected=''){}
}

export class LanguageConfig{
    constructor(public question='', public selected='', public answers=['', '', '']){}
}

export class FeedbackExercise extends Exercise {
    public answers:FeedbackResultConfig[]=[];
    constructor(public title = '') {
        super(title);
    }
}

export class AdultFeedbackExercise extends Exercise {
    public adultAnswers:LanguageConfig[]=[];
    public code:string='';
    constructor(public title = '') {
        super(title);
    }
}

export class FeedbackConnector extends Exercise {
    constructor(public title = '') {
        super(title);
    }
}