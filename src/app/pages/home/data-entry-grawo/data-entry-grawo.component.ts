import {Component, OnInit, ViewChild, ElementRef, ViewChildren, QueryList} from '@angular/core';
import {AlertController, NavController} from '@ionic/angular';
import {Router, ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {
  DateAdapter,
  MatDatepickerInputEvent,
  MatInput,
  MatFormField,
  MatFormFieldControl,
  MatSelect
} from '@angular/material';
import {DataService} from 'src/app/services/data.service';
import {Storage} from '@ionic/storage';
import {Student} from '../../../classes/student';
import {School} from '../../../classes/school';
import {Examiner} from '../../../classes/examiner';
import {flattenStyles} from '@angular/platform-browser/src/dom/dom_renderer';
import {Keyboard} from '@ionic-native/keyboard';
import {RestService} from 'src/app/services/rest.service';

@Component({
  selector: 'app-data-entry-grawo',
  templateUrl: './data-entry-grawo.component.html',
  styleUrls: ['./data-entry-grawo.component.scss'],
})
export class DataEntryGrawoPage implements OnInit {

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

  studentcode = '';
  school = '';
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
  }

  fillDatasheet(){  
    if (this.dataService.current_user && this.dataService.current_user.name) {
      this.studentcode = this.dataService.current_user.name;
      this.school = this.dataService.getSchoolById(this.dataService.current_user.schoolId).name;
      
      this.note = this.dataService.current_user.note;
    }
    else{      
      if (this.dataService.current_user !== null){
        let names = this.dataService.current_user.toString().split(' ');
        this.studentcode = names.slice(0, names.length - 1).join(' ');
        this.dataService.current_user = null;
      }
      else{
        this.studentcode = '';
      }
      this.school = this.dataService.getSchoolById(this.dataService.current_school).name;

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

  nextPage() {

    if (this.examinerName != null)
      this.storage.set(this.dataService.keyCurrentExaminer, JSON.stringify(this.examinerName));

    const school = new School(this.dataService.getSchoolByName(this.school).id, this.school, []);

    const germanBool = true;
    const spfBool = false;
    const aoBool = false;
    const currentlyPreschoolBool: boolean = false;
    const alreadyPreschoolBool: boolean = false;


    if (this.dataService.current_user === null){
      this.dataService.current_user = new Student(
        '',
        '',
        true,
        school,
        '-',
        '-',
        germanBool,
        '-',
        spfBool,
        aoBool,
        currentlyPreschoolBool,
        alreadyPreschoolBool,
        this.note,
        this.studentcode,
        new Date(1,1,1),
        '-');
    }
    else{
      // TODO: Clarify which fields may be updated for an existing student, 
      // otherwise disable input fields ...
      this.dataService.current_user.name = this.studentcode;
      this.dataService.current_user.school = school;
      this.dataService.current_user.className = '-';
      this.dataService.current_user.alreadyPreschool = alreadyPreschoolBool;
      this.dataService.current_user.currentlyPreschool = currentlyPreschoolBool;
      this.dataService.current_user.note = this.note;
      this.dataService.current_user.spf = spfBool;
      this.dataService.current_user.ao = aoBool;
    }
    
    //console.log('current user: ');
    //console.log(this.dataService.current_user);
    const ex = new Examiner(this.examinerName);
    // TODO: Replace Examiner-object with Examiner-string only
    this.dataService.initNewTest(this.dataService.current_user, ex, this.testdate);
    /*if(this.dataService.current_testset.title.toLowerCase().includes("gralev"))
    {
      console.log(this.dataService.current_testset.title);
      this.router.navigate(['gralev-first-text']);
    }else{*/console.log(this.dataService.current_testset.exercises[0]);
      this.router.navigate([this.dataService.current_testset.exercises[0].route]);
    //}
  }
}