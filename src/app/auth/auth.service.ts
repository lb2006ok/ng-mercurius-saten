import * as firebase from 'firebase';

export class AuthService {
  register(email: string, password: string) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      );
  }

  login(email: string, password: string) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(
        error => console.log(error)
      );
  }

  getIdToken() {
    return firebase.auth().currentUser.getIdToken();
  }
}
