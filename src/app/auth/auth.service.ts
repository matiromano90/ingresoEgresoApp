import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { User } from './user.model';
import { AngularFirestore } from 'angularfire2/firestore';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) { }

  initAuthListener() {

    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      console.log(fbUser);
    });
  }

  crearUsuario( nombre: string, email: string, password: any ) {

    this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then( (resp => {

          const user: User = {
            uid: resp.user.uid,
            nombre:  nombre,
            email: resp.user.email
          };

        this.afDB.doc(`${ user.uid }/usuario`)
          .set( user )
          .then( () => {
            this.router.navigate(['/']);
          });

        }))
        .catch( error => {
          console.error(error);
          swal('Error al crear usuario', error.message, 'error');
        });
  }

  login(email: string, password: any) {

    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then( (resp) => {
        /* console.log(resp); */
        this.router.navigate(['/']);
      })
      .catch( error => {
        console.error(error);
        swal('Error en el login', error.message, 'error');
      });
  }

  logout() {

    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState
        .pipe(
          map( fbUser => {

            if (fbUser == null) {
              this.router.navigate(['/login']);
            }
          return  fbUser != null;
          })
        );
  }
}
