import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingtraining = false;
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) {
  }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(
      exercice => {
        if (exercice) {
          this.ongoingtraining = true;
        } else {
          this.ongoingtraining = false;
        }
      }
    );
  }

  ngOnDestroy() {
    this.exerciseSubscription.unsubscribe();
  }
}
