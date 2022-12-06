export enum Correct{
    Richtig = "Richtig",
    Falsch = "Falsch"
}
export class GraDigAnswer {
    constructor(
        public number = 0,
        public correctWord = '',
        public word = '',
        public duration='',
        public correct = Correct.Falsch
    ) {
    }

    public toString() {
        return "number: " + this.number + " word: " + this.word + " correct: " + this.correct;
    }
}