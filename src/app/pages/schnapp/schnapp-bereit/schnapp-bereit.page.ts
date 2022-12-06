import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-schnapp-bereit',
  templateUrl: './schnapp-bereit.page.html',
  styleUrls: ['./schnapp-bereit.page.scss'],
})
export class SchnappBereitPage implements OnInit {

  constructor(private router: Router, public data: DataService) { }

  ngOnInit() {
  }

  nextPage() {
    this.router.navigate([this.data.current_testset.exercises[0].route]);
}

}
