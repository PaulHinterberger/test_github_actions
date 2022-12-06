export enum Correct{
    Richtig = "Richtig",
    Falsch = "Falsch"
}
export class Answer {
    constructor(
        public number = 0,
        public word = '',
        public correct = Correct.Falsch
    ) {
    }

    public toString() {
        return "number: " + this.number + " word: " + this.word + " correct: " + this.correct;
    }
}