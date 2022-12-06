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
  selector: 'app-data-entry-main',
  templateUrl: './data-entry-main.page.html',
  styleUrls: ['./data-entry-main.page.scss'],
})
export class DataEntryMainPage implements OnInit {

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

    this.languages.sort((a, b) => {
      if (a.value === 'german' || b.value === 'german') {
        return a.speakingnumber;
      } else {
        return a.viewValue.localeCompare((<string>b.viewValue));
      }
    });

  }

  @ViewChildren('input') inputs: QueryList<MatInput>;

  lastname = '';
  firstname = '';
  gender = 'null';
  nativeLanguage = 'null';
  school = '';
  className = '';
  aoAnswer = 'null';
  spfAnswer = 'null';
  spfNote = '';
  currentlyPreschoolAnswer = 'null';
  alreadyPreschoolAnswer = 'null';

  languages: LanguageSelect[] = [
    {value: 'german', viewValue: 'Deutsch', speakingnumber: 300000},
    {value: 'turkish', viewValue: 'Türkisch', speakingnumber: 183445},
    {value: 'serbian', viewValue: 'Serbisch', speakingnumber: 177320},
    {value: 'croatian', viewValue: 'Kroatisch', speakingnumber: 131307},
    {value: 'english', viewValue: 'Englisch', speakingnumber: 58582},
    {value: 'bosnian', viewValue: 'Bosnisch', speakingnumber: 34857},
    {value: 'polish', viewValue: 'Polnisch', speakingnumber: 30598},
    {value: 'albanian', viewValue: 'Albanisch', speakingnumber: 28212},
    {value: 'italian', viewValue: 'Italienisch', speakingnumber: 10742},
    {value: 'french', viewValue: 'Französisch', speakingnumber: 10190},
    {value: 'macedonian', viewValue: 'Mazedonisch', speakingnumber: 5145},
    {value: 'greek', viewValue: 'Griechisch', speakingnumber: 3098},
    {value: 'kurdish', viewValue: 'Kurdisch', speakingnumber: 2133},
    {value: 'hungarian', viewValue: 'Ungarisch', speakingnumber: 40583},
    {value: 'slovenian', viewValue: 'Slowenisch', speakingnumber: 24855},
    {value: 'burgenland_croatian', viewValue: 'Burgenlandkroatisch', speakingnumber: 19412},
    {value: 'czech', viewValue: 'Tschechisch', speakingnumber: 17742},
    {value: 'slovakian', viewValue: 'Slowakisch', speakingnumber: 10234},
    {value: 'romani', viewValue: 'Romänisch', speakingnumber: 6273},
    {value: 'persian', viewValue: 'Persisch', speakingnumber: 1},
    {value: 'arabic', viewValue: 'Arabisch', speakingnumber: 0},
    {value: 'chechen', viewValue: 'Tschetschenisch', speakingnumber: 0},
    {value: 'russian', viewValue: 'Russisch', speakingnumber: 0},
    {value: 'others', viewValue: 'Sonstige', speakingnumber: 0},
  ];
  birthdate_startDate: Date = new Date();
  birthdateControl = new FormControl(this.birthdate_startDate);
  dateTodayControl = new FormControl(new Date());
  note = '';
  noteFocus = false;
  examinerName = '';
  examinerNameFocus = false;

  public birthdate: Date = new Date(this.birthdateControl.value);
  public testdate = new Date(this.dateTodayControl.value);

  async ngOnInit() {

    //this.fillDatasheet();
    document.addEventListener('backbutton', function (e) {
      console.log('disable back button');
    }, false);
  }

  fillDatasheet(){  
    if (this.dataService.current_user && this.dataService.current_user.name) {
      let names = this.dataService.current_user.name.split(' ');
      this.firstname = names.slice(0, names.length - 1).join(' ');
      this.lastname = names[names.length - 1];
      this.birthdate = this.dataService.current_user.birthDate;
      this.birthdate_startDate = this.birthdate;
      this.gender = this.dataService.current_user.sex;
      this.school = this.dataService.getSchoolById(this.dataService.current_user.schoolId).name;
      this.className = this.dataService.current_user.className;
      this.nativeLanguage = this.dataService.current_user.nativeLanguage;

      this.aoAnswer = this.dataService.current_user.ao ? 'yes' : 'no';
      this.spfAnswer = this.dataService.current_user.spf ? 'yes' : 'no';
      this.spfNote = this.dataService.current_user.spfNote;
      this.alreadyPreschoolAnswer = this.dataService.current_user.alreadyPreschool ? 'yes' : 'no';
      this.currentlyPreschoolAnswer = this.dataService.current_user.currentlyPreschool ? 'yes' : 'no';

      this.note = this.dataService.current_user.note;
    }
    else{      
      if (this.dataService.current_user !== null){
        let names = this.dataService.current_user.toString().split(' ');
        this.firstname = names.slice(0, names.length - 1).join(' ');
        this.lastname = names[names.length - 1];
        this.dataService.current_user = null;
      }
      else{
        this.lastname = '';
        this.firstname = '';
      }

      this.birthdate_startDate = new Date();
      this.birthdate_startDate.setFullYear(new Date().getFullYear() - 6);
      this.birthdate_startDate.setMonth(0);
      this.birthdate_startDate.setDate(1);
      this.birthdate = this.birthdate_startDate;
      this.gender = 'null';
      this.school = this.dataService.getSchoolById(this.dataService.current_school).name;
      this.className = '';
      this.nativeLanguage = 'null';

      this.aoAnswer = 'null';
      this.spfAnswer = 'null';
      this.spfNote = '';
      this.currentlyPreschoolAnswer = 'null';
      this.alreadyPreschoolAnswer = 'null';

      this.note = '';
    }

    this.birthdateControl = new FormControl(this.birthdate_startDate);
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

  setNewBirthdate(event: MatDatepickerInputEvent<Date>) {
    this.birthdate = event.value;
  }

  setNewTestdate(event: MatDatepickerInputEvent<Date>) {
    this.testdate = event.value;
  }

  nextPage() {

    if (this.examinerName != null)
      this.storage.set(this.dataService.keyCurrentExaminer, JSON.stringify(this.examinerName));

    const school = new School(this.dataService.getSchoolByName(this.school).id, this.school, []);

    const germanBool = this.nativeLanguage.toLowerCase() === 'german';
    const spfBool = this.spfAnswer === 'yes';
    const aoBool = this.aoAnswer === 'yes';
    const currentlyPreschoolBool: boolean = this.currentlyPreschoolAnswer === 'yes';
    const alreadyPreschoolBool: boolean = this.alreadyPreschoolAnswer === 'yes';

    if (!spfBool) {
      this.spfNote = '';
    }

    if (this.dataService.current_user === null){
      this.dataService.current_user = new Student(
        '',
        '',
        true,
        school,
        this.className,
        this.nativeLanguage,
        germanBool,
        this.spfNote,
        spfBool,
        aoBool,
        currentlyPreschoolBool,
        alreadyPreschoolBool,
        this.note,
        this.firstname + ' ' + this.lastname,
        this.birthdate,
        this.gender);
    }
    else{
      // TODO: Clarify which fields may be updated for an existing student, 
      // otherwise disable input fields ...
      this.dataService.current_user.name = this.firstname + ' ' + this.lastname;
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
    if(this.dataService.current_testset.exercises[0].route.startsWith("lv")){
        this.router.navigate(['lv-bereit']);
    }
    else{
        this.router.navigate([this.dataService.current_testset.exercises[0].route]);
    }
  }

  async onSpf(yes: boolean) {
    if (yes) {
      // if (this.note.length !== 0) {
      //     if (this.note.includes('Körperbehinderung')) {
      //         this.note = this.note.replace('Körperbehinderung', '');
      //     }
      //     if (this.note.includes('Sinnesbeeinträchtigung')) {
      //         this.note = this.note.replace('Sinnesbeeinträchtigung', '');
      //     }
      //     if (this.note.includes('Kognitive / Lernbeeinträchtigung')) {
      //         this.note = this.note.replace('Kognitive / Lernbeeinträchtigung', '');
      //     }
      // }
      // this.note = this.note.trim();

      const alert = await this.alertController.create({
        cssClass: 'spf-alert',
        backdropDismiss: false,
        header: 'SPF Auswahlliste',
        inputs: [
          {
            name: 'physicalDisabilityCheckbox',
            type: 'radio',
            label: 'Körperbehinderung?',
            checked: this.spfNote.includes('Körperbehinderung'),
            handler: input => {
              this.spfNote = '';
              if (input.checked) {
                this.spfNote += 'Körperbehinderung';
              }
            }
          },
          {
            name: 'senseImpairmenCheckbox',
            type: 'radio',
            label: 'Sinnesbeeinträchtigung (Hören, Sehen)?',
            checked: this.spfNote.includes('Sinnesbeeinträchtigung'),
            handler: input => {
              this.spfNote = '';
              if (input.checked) {
                this.spfNote += 'Sinnesbeeinträchtigung';
              }
            }
          },
          {
            name: 'cognitive-learningImpairmentCheckbox',
            type: 'radio',
            label: 'Kognitive / Lernbeeinträchtigung?',
            checked: this.spfNote.includes('Kognitive / Lernbeeinträchtigung'),
            handler: input => {
              this.spfNote = '';
              if (input.checked) {
                this.spfNote += 'Kognitive / Lernbeeinträchtigung';
              }
            }
          }
        ],
        buttons: [
          {
            role: 'cancel',
            text: 'Abbrechen',
            handler: async () => {
              if (this.spfNote.includes('Körperbehinderung')) {
                this.spfNote = this.spfNote.replace('Körperbehinderung', '');
              }
              if (this.spfNote.includes('Sinnesbeeinträchtigung')) {
                this.spfNote = this.spfNote.replace('Sinnesbeeinträchtigung', '');
              }
              if (this.spfNote.includes('Kognitive / Lernbeeinträchtigung')) {
                this.spfNote = this.spfNote.replace('Kognitive / Lernbeeinträchtigung', '');
              }
              this.spfNote = this.spfNote.trim();
              await this.alertController.dismiss();
            }
          },
          {
            text: 'Ok',
            handler: async () => {
              this.spfNote = this.spfNote.trim();
              await this.alertController.dismiss();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.spfNote = '';
    }
  }
}

export interface LanguageSelect {
  value: String;
  viewValue: String;
  speakingnumber: number;
}

export interface SchoolSelect {
  value: String;
  viewValue: String;
}
