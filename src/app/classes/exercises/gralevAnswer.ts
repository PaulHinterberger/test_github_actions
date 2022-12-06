export enum Correct{
    Richtig = "Richtig",
    Falsch = "Falsch"
}
export class GraLeVAnswer {
    constructor(
        public number = 0,
        public correctWord = '',
        public word = '',
        public correct = Correct.Falsch
    ) {
    }

    public toString() {
        return "number: " + this.number + " word: " + this.word + " correct: " + this.correct;
    }
}