export class Exercise {
    public number? = 0;
    public note? = '';
    public finished? = false;
    public configFile? = "";
    constructor(
        public title = '',
        public route = ''
    ) {
    }
    toString(){
        var tostring = "number: " + this.number + " title: " +  this.title + " route: " + this.route + " note: " + this.note + " finished: " + this.finished;
        console.log(tostring)
        return tostring;
    }
}
