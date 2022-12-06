import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Result} from '../classes/result';
import {HashService} from './hash.service';

import user from '../../assets/login.json';
import {School} from '../classes/school';
import {environment} from 'src/environments/environment';
import {TestTemplate} from '../classes/testTemplate';
import {Student} from '../classes/student';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestService {
    baseUrl: string;
    token = null;

    constructor(
        private http: HttpClient) {
        //this.baseUrl = environment.httpUrl;
    }

    setBaseUrl(url: string) {
        this.baseUrl = url;
    }

    sendResults(result: Result) {
        console.log('Posting result to server: ');
        console.log(result);
        const toSend = {
            examiner: result.examiner,
            student: result.student,
            testTemplateId: result.testTemplateId,
            testingDate: result.testingDate,
            version: result.version,
            endDate: result.endDate,
            uploadDate: new Date(),
            results: JSON.stringify(result.results)
        };
        let headers: HttpHeaders = new HttpHeaders();
        headers = this.addAuthorizationHeader(headers);
        return this.http.post(
            this.baseUrl + 'results',
            toSend,
            {headers: headers}).toPromise();
    }

    async ping() {
        return this.http.get(this.baseUrl + 'auth/ping').toPromise()
   }

    async checkLogin() {
        let uploadUser = 
            {
                'Username' : user.username,
                'Password':  HashService.getHashed(user.password, this.baseUrl)
            };  
        return this.http.post<any>(
            this.baseUrl + 'auth/login', 
            uploadUser)
            .toPromise();
    }

    getSchools() {
        let headers: HttpHeaders = new HttpHeaders();
        headers = this.addAuthorizationHeader(headers);
        return this.http.get<School[]>(
            this.baseUrl + 'schools/all',
            {headers});
    }

    addAuthorizationHeader(headers: HttpHeaders) {
        return headers.append('Authorization', 'Bearer ' + this.token.token);
    }

    getTestTemplate() {
        let headers: HttpHeaders = new HttpHeaders();
        headers = this.addAuthorizationHeader(headers);
        return this.http.get<TestTemplate[]>(
            this.baseUrl + 'testtemplates/active',
            {headers});
    }

    getStudents() {
        let headers: HttpHeaders = new HttpHeaders();
        headers = this.addAuthorizationHeader(headers);
        /*return this.http.get<Student[]>(
            this.baseUrl + 'students/all',
            {headers})
            .pipe(
                map(res => new Student(res['isStudent'], res['school'], res['className'], res['nativeLanguage'],
                    res['germanFirstLanguage'], res['spfNote'], res['spf'], res['ao'], res['currentlyPreschool'],
                    res['alreadyPreschool'], res['note'], res['name'], res['birthDate'], res['sex'], res['education_mother'],
                    res['education_father'], res['dyslexia_mother'], res['dyslexia_father'], res['dyslexia_sibling'],
                    res['dyslexia_grandParent'], res['dyslexia_otherRelatives'])));*/
        return this.http.get<Student[]>(
            this.baseUrl + 'students/all',
            {headers});
    }
}
