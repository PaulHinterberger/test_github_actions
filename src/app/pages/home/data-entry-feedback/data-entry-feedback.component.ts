
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, MatDatepickerInputEvent, MatInput } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { Examiner } from 'src/app/classes/examiner';
import { School } from 'src/app/classes/school';
import { Student } from 'src/app/classes/student';
import { DataService } from 'src/app/services/data.service';
import { RestService } from 'src/app/services/rest.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-data-entry-feedback',
  templateUrl: './data-entry-feedback.component.html',
  styleUrls: ['./data-entry-feedback.component.scss'],
})
export class DataEntryFeedbackComponent implements OnInit {
  
  constructor(
    public dataService: DataService,
    private storage: Storage,
    private adapter: DateAdapter<any>,
    public navCtrl: NavController,
    private router: Router,
    private alertController: AlertController,
    route: ActivatedRoute,
    private restService: RestService
  ) {
    route.params.subscribe(val => {
      this.fillDatasheet();
    });

  }

  @ViewChildren('input') inputs: QueryList<MatInput>;

  code = '';
  className = '';
  currentSchool = '';

  dateTodayControl = new FormControl(new Date());
  note = '';
  noteFocus = false;
  examinerName = '';
  examinerNameFocus = false;

  public testdate = new Date(this.dateTodayControl.value);

  async ngOnInit() {
  //this.fillDatasheet();
    document.addEventListener('backbutton', function (e) {
      console.log('disable back button');
    }, false);
    this.examinerName = '';
  }

  fillDatasheet() {
    if (this.dataService.current_user && this.dataService.current_user.name) {
      this.code = this.dataService.current_user.name;
      this.className = this.dataService.current_user.className;
      console.log(this.dataService.current_user.name.split('-')[0]);
      if(this.dataService.current_testset.title.includes('Leseförderprojekt')){
        this.currentSchool = this.dataService.getSchoolById(this.dataService.current_user.schoolId).name;
      }else{
        this.currentSchool = this.dataService.current_user.name.split('-')[0];
      }
      this.note = this.dataService.current_user.note;
    }
    else {
      if (this.dataService.current_user !== null) {
        let names = this.dataService.current_user.toString().split(' ');
        this.code = names.slice(0, names.length - 1).join(' ');
        this.dataService.current_user = null;
      }
      else {
        this.code = '';
      }

      this.currentSchool = this.dataService.getSchoolById(this.dataService.current_school).name;
     
      this.note = '';
    }

    this.dateTodayControl = new FormControl(new Date());
    this.testdate = this.dateTodayControl.value;

    this.examinerName = '';
    this.storage.get(this.dataService.keyCurrentExaminer).then((val) => {
      this.examinerName = JSON.parse(val) || '';
    },
      () => this.examinerName = '');
    this.examinerNameFocus = false;
    this.noteFocus = false;
    this.adapter.setLocale('aut');
  }

  setNewTestdate(event: MatDatepickerInputEvent<Date>) {
    this.testdate = event.value;
  }

  async onContinue(){
    const alert = await this.alertController.create({
      header: 'Wirklich weiter?',
      message: 'Kontrollieren Sie, ob die ID <br/><b>' + this.code + '</b> <br/>die richtige ist.',
      buttons: [
          {
              text: 'Abbrechen',
              handler: async () => {
                  await this.alertController.dismiss();
                  this.router.navigate(['home']);
              }
          },
          {
              text: 'Weiter',
              handler: async () => {
                  setTimeout(() =>{
                      this.nextPage();
                  }, 500);
              }
          }],
      backdropDismiss: true
    });
    await alert.present();
  }

  nextPage() {

    if (this.examinerName != null){
      this.storage.set(this.dataService.keyCurrentExaminer, JSON.stringify(this.examinerName));
    }

    const school = new School(this.dataService.getSchoolByName(this.currentSchool).id, this.currentSchool, []);

    const germanBool = true;
    const spfBool = false;
    const aoBool = false;
    const currentlyPreschoolBool: boolean = false;
    const alreadyPreschoolBool: boolean = false;

    if (this.dataService.current_user === null) {
      this.dataService.current_user = new Student(
        '',
        '',
        true,
        school,
        this.className,
        '-',
        germanBool,
        '-',
        spfBool,
        aoBool,
        currentlyPreschoolBool,
        alreadyPreschoolBool,
        this.note,
        this.code,
        new Date(1,1,1),
        '-');
    }
    else {
      // TODO: Clarify which fields may be updated for an existing student, 
      // otherwise disable input fields ...
      this.dataService.current_user.name = this.code;
      this.dataService.current_user.school = school;
      this.dataService.current_user.className = this.className;
      this.dataService.current_user.alreadyPreschool = alreadyPreschoolBool;
      this.dataService.current_user.currentlyPreschool = currentlyPreschoolBool;
      this.dataService.current_user.note = this.note;
      this.dataService.current_user.spf = spfBool;
      this.dataService.current_user.ao = aoBool;
    }

    // console.log('current user: ');
    // console.log(this.dataService.current_user);
    const ex = new Examiner(this.examinerName);
    // TODO: Replace Examiner-object with Examiner-string only
    this.dataService.initNewTest(this.dataService.current_user, ex, this.testdate);
    // this.router.navigate(['data-entry-anamnese']);
    this.dataService.saveResult(false);
    if (this.dataService.current_testset.exercises[0].route.startsWith("lv")) {
      this.router.navigate(['lv-bereit']);
    }
    else if (this.dataService.current_testset.exercises[0].route.startsWith("map")) {
      this.router.navigate(['schnapp-bereit']);
    }
    else {
      this.router.navigate([this.dataService.current_testset.exercises[0].route]);
    }
  }
}

