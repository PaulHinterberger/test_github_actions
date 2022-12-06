export class GraLeVTextConfig {
    constructor(
        public wordNr = 0,
        public history = 0, 
        public answers = ['', '', ''], 
        public correctAnswer = '',
        public selected = '') {
    }
}
export class HistoryPartConfig{
    constructor(
        public historyPart = '',
        public frontWord = 0,
        public nextWord = 0,
        public historyNr = 0,
    ){}
}
export class GraDigHistoryPartConfig{
    constructor(
        public iconCount = 0,
        public icon='',
        public nextWord = 0,
        public historyNr = 0,
    ){}
}