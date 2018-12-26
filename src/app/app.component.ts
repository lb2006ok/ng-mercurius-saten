import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'ng-mercurius-saten';

  ngOnInit() {
    firebase.initializeApp({
      apiKey: "AIzaSyBgYLdR9h43Mi1FGQV2P9Bs3lxESuO5ycs",
      authDomain: "ng-mercurius-saten.firebaseapp.com",
    })
  }
}
