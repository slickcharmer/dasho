import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { from } from 'rxjs/observable/from';

import { User } from '../shared/user.model';

/**
 * Represents the user provider
 */
@Injectable()
export class UserProvider {
  _favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';

  /**
   * Create the user data provider
   * @param  {Events}  privateevents  Used to publish to the users events
   * @param  {Storage} privatestorage Used to store the user data
   */
  constructor(
    private events: Events,
    private storage: Storage) { }

  /**
   * Checks if is the string a invalid email address
   * @param  {string}  value The string to test
   * @return {boolean}       Return true if the value is NOT an email address
   */
  isMailInvalid(value: string): boolean {
    // tslint:disable-next-line:max-line-length
    const emailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return !emailRegex.test(value);
  }

  /**
   * Removes all storage information and publish the `user:logout` event
   */
  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('user');
    this.storage.remove('token');
    this.events.publish('user:logout');
  }

  /**
   * Set the userdata in the storage (after successful login)
   * @param {User} user
   */
  setsUserdata(user: User): Observable<void> {
    return from(this.storage.set('user', user)
      .then(() => {
        return this.storage.set(this.HAS_LOGGED_IN, true);
      }));
  }

  /**
   * Set the Token
   * @param {string} token
   */
  setsAccessToken(token: string): Observable<void> {
    return from(this.storage.set('token', token));
  }

  /**
   * Get the access token from the storage
   * @return {Promise}
   */
  getAccessToken(): Observable<string> {
    return from(this.storage.get('token')
      .then(value => {
        return value;
      }));
  }

  /**
   * Get the username from the storage
   * @return {Promise}
   */
  getUsername(): Observable<string> {
    return from(this.storage.get('user')
      .then(value => {
        return value.username;
      }));
  }

  /**
   * Get the user from the storage
   * @return {Promise}
   */
  getUser(): Observable<User> {
    return from(this.storage.get('user')
      .then(value => {
        return value;
      }));
  }

  /**
   * Get variable if the user has logged in
   * @return {Promise}
   */
  hasLoggedIn(): Observable<boolean> {
    return from(this.storage.get(this.HAS_LOGGED_IN)
      .then(value => {
        return value === true;
      }));
  }
}