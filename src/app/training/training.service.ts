import { AngularFirestore } from 'angularfire2/firestore'
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

import { Exercise } from './exercise.model';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[];
  private runningExercise: Exercise;

  constructor(private db: AngularFirestore) {
    // this.availableExercises = db.collection().snapshotChanges().pipe(map)
  }
  fetchAvailableExercises() {
    this.db
      .collection("availiableExercises")
      .snapshotChanges()
      .pipe(map(docArray => {
          return docArray.map(doc => {
            return { id: doc.payload.doc.id, ...doc.payload.doc.data() };
          });
        }))
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
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
    this.db
      .collection("finishedExercises")
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      });
  }

  addDataToDatabase(exercise: Exercise){
    this.db.collection('finishedExercises').add(exercise);
  }
}
