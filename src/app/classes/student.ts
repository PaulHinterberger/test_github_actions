import {School} from './school';

export class Student {
    constructor(
        public id = '0',
        public schoolId = '',
        public isStudent = true,
        public school: School = null,
        public className = '',
        public nativeLanguage = '',
        public germanFirstLanguage = false,
        public spfNote = '',
        public spf = false,
        public ao = false,
        public currentlyPreschool = false,
        public alreadyPreschool = false,
        public note = '',
        public name = '',
        public birthDate: Date = null,
        public sex = '',
        public educationMother = 'keine Angabe',
        public educationFather = 'keine Angabe',
        public dyslexiaMother = false,
        public dyslexiaFather = false,
        public dyslexiaSibling = false,
        public dyslexiaGrandparent = false,
        public dyslexiaOtherRelatives = false
    ) {
    }


    public toString() {
        return this.name + ' | ' + this.className;
    }
}
