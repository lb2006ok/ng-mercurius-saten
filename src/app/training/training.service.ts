import { AngularFirestore } from 'angularfire2/firestore'
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';

import { Exercise } from './exercise.model';
import { map } from 'rxjs/operators';
import { UIService } from '../share/ui.service';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private fbSubs: Subscription[] = [];
  private availableExercises: Exercise[];
  private runningExercise: Exercise;

  constructor(private db: AngularFirestore, private uiService: UIService) {
    // this.availableExercises = db.collection().snapshotChanges().pipe(map)
  }
  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db
      .collection("availiableExercises")
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return { id: doc.payload.doc.id, ...doc.payload.doc.data() };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
        this.uiService.loadingStateChanged.next(false);
      }, error => {
        this.uiService.showSnackbar('Fetch Exercises Failed, please try again later', null, 3000);
        this.exercisesChanged.next(null);
        this.uiService.loadingStateChanged.next(false);
      }));
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  startExercise(selectId: string) {

    this.runningExercise = this.availableExercises.find(ex => ex.id === selectId);
    this.exerciseChanged.next({...this.runningExercise});
  }

  getRunningExercise() {
    return {...this.runningExercise};
  }

  fetchCompleteOrCancelledExercises() {
    this.fbSubs.push(this.db
      .collection("finishedExercises")
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      }));
  }

  cancelSubscriptions() {
    this.fbSubs.forEach(sub => {
      sub.unsubscribe();
    })
  }
  addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
