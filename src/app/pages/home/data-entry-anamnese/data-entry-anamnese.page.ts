import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataService} from 'src/app/services/data.service';

@Component({
    selector: 'app-data-entry-anamnese',
    templateUrl: './data-entry-anamnese.page.html',
    styleUrls: ['./data-entry-anamnese.page.scss'],
})
export class DataEntryAnamnesePage implements OnInit {

    constructor(private router: Router, public dataService: DataService, route: ActivatedRoute) {
        route.params.subscribe(val => {
            this.dyslexia_mother = '';
            this.dyslexia_father = '';
            this.dyslexia_sibling = '';
            this.dyslexia_grandParent = '';
            this.dyslexia_otherRelatives = '';
            this.education_mother = 'keine Angabe';
            this.education_father = 'keine Angabe';
        });
    }

    public dyslexia_mother = '';
    public dyslexia_father = '';
    public dyslexia_sibling = '';
    public dyslexia_grandParent = '';
    public dyslexia_otherRelatives = '';
    public education_mother = 'keine Angabe';
    public education_father = 'keine Angabe';
    public name = '';

    ngOnInit() {
        if (this.dataService.current_user != null) {
            // console.log(this.dataService.current_user);
            this.dyslexia_mother = this.dataService.current_user.dyslexiaMother ? 'yes' : 'no';
            this.dyslexia_father = this.dataService.current_user.dyslexiaFather ? 'yes' : 'no';
            this.dyslexia_grandParent = this.dataService.current_user.dyslexiaGrandparent ? 'yes' : 'no';
            this.dyslexia_sibling = this.dataService.current_user.dyslexiaSibling ? 'yes' : 'no';
            this.dyslexia_otherRelatives = this.dataService.current_user.dyslexiaOtherRelatives ? 'yes' : 'no';
            this.education_father = this.dataService.current_user.educationFather;
            this.education_mother = this.dataService.current_user.educationMother;
            this.name = this.dataService.current_user.name;
        }
    }

    nextPage() {
        
        this.dataService.result.student.dyslexiaSibling = this.dyslexia_sibling === 'yes';
        this.dataService.result.student.dyslexiaGrandparent = this.dyslexia_grandParent === 'yes';
        this.dataService.result.student.dyslexiaMother = this.dyslexia_mother === 'yes';
        this.dataService.result.student.dyslexiaFather = this.dyslexia_father === 'yes';
        this.dataService.result.student.dyslexiaOtherRelatives = this.dyslexia_otherRelatives === 'yes';
        this.dataService.result.student.educationFather = this.education_father;
        this.dataService.result.student.educationMother = this.education_mother;
        //console.log(this.dataService.result.student);
        this.dataService.saveResult(false);
        if(this.dataService.current_testset.exercises[0].route.startsWith("lv")){
            this.router.navigate(['lv-bereit']);
        }
        else{
            this.router.navigate([this.dataService.current_testset.exercises[0].route]);
        }
     }
}
