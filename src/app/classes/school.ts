export class School {
    constructor(
        public id = '',
        public name = '',
        public classes = []
    ) {
    }

    public toString() {
        return this.name;
    }
}
