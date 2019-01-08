import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as TRAINING from './training.actions';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {
  }

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(
      this.db
        .collection('availiableExercises')
        .snapshotChanges()
        .pipe(
          map(docArray => {
            return docArray.map(doc => {
              return {id: doc.payload.doc.id, ...doc.payload.doc.data()};
            });
          })
        )
        .subscribe(
          (exercises: Exercise[]) => {
            this.store.dispatch(new TRAINING.SetAvailableTraining(exercises));
            this.store.dispatch(new UI.StopLoading());
          },
          error => {
            this.uiService.showSnackbar(
              'Fetch Exercises Failed, please try again later',
              null,
              3000
            );
            this.store.dispatch(new UI.StopLoading());
          }
        )
    );
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((ex: Exercise) => {
      this.addDataToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new TRAINING.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((ex: Exercise) => {
      this.addDataToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new TRAINING.StopTraining());
    });

  }

  startExercise(selectId: string) {
    this.store.dispatch(new TRAINING.StartTraining(selectId));
  }

  fetchCompleteOrCancelledExercises() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.store.dispatch(new TRAINING.SetFinishedTraining(exercises));
        })
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => {
      sub.unsubscribe();
    });
  }

  addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
