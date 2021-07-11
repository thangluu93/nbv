import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Cây Kim Sợi Chỉ';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.route.data.subscribe( a => {
    //   console.log(a);
    // })
  }
}
